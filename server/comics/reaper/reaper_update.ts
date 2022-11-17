var DomParser = require('dom-parser');
var parser = new DomParser();
import { DefaultManhwa, ManhwaT } from '../Types'
import { last_manhwa_updated, manhwa_update } from '../DB_functions'
import { RateLimiter } from "limiter";

const axios = require('axios')

const time_convert = (time: string, constant: number): string => {
    let now = new Date();
    time = time.replace('Released','');
    let number = /\d+/;
    let amount_of_time: number = Number(time.match(number)![0]);
    time.replace('\n','');
    let period = time.split(' ')[1];

    switch(period) {
        case 'second':
        case 'seconds':
            now.setSeconds(now.getSeconds() - amount_of_time)
            break;
        case 'minute':
        case 'minutes':
            now.setMinutes(now.getMinutes() - amount_of_time)
            now.setSeconds(now.getSeconds() - constant);
            break;
        case 'hour':
        case 'hours':
            now.setHours(now.getHours() - amount_of_time)
            now.setSeconds(now.getSeconds() - constant);
            break;
        case 'day':
        case 'days':
            now.setDate(now.getDate() - amount_of_time)
            now.setSeconds(now.getSeconds() - constant);
            break;
        case 'week':
        case 'weeks':
            now.setDate(now.getDate() - (amount_of_time*7))
            now.setSeconds(now.getSeconds() - constant);
            break
        case 'month':
        case 'months':
            now.setMonth(now.getMonth() - amount_of_time)
            now.setSeconds(now.getSeconds() - constant);
            break;
        case 'year':
        case 'years':
            now.setMonth(now.getMonth() - (amount_of_time*12))
            now.setSeconds(now.getSeconds() - constant);
            break;
    }

    return now.toISOString()
}

const reaper_data_update = async (manhwa,c): Promise<ManhwaT> => {
    
    let data: ManhwaT = DefaultManhwa;
    data.Link = manhwa.getElementsByClassName('flex-shrink-0')[0].getElementsByTagName('a')[0].attributes[0].value;
    data.Name = manhwa.getElementsByClassName('flex-shrink-0')[0].getElementsByTagName('a')[0].getElementsByTagName('img')[0].attributes[2].value;
    data.Image = manhwa.getElementsByClassName('flex-shrink-0')[0].getElementsByTagName('a')[0].getElementsByTagName('img')[0].attributes[1].value;

    let release;
    await axios.get(data.Link)
    .then(res => release = parser.parseFromString(res.data))
    .catch(error => console.log("URL OF MANHWA FAILED TO FETCH REAPER SCANS"))
    
    let find = /\d+/;
    data.Chapter = release.getElementsByTagName('ul')[0].getElementsByTagName('p')[0].textContent.split('Chapter')[1].match(find)[0];
    data.Status = release.getElementsByTagName('dl')[0].getElementsByTagName('div')[1].getElementsByTagName('dd')[0].textContent;
    data.Modified = time_convert(release.getElementsByTagName('ul')[0].getElementsByTagName('p')[1].textContent, c);
    return new Promise((resolve,reject) => { resolve(data) })
}

export const reaper_update = async () => {
    
    const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 1250 });
    let config =  { "headers": { "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9","accept-language": "en-GB,en-US;q=0.9,en;q=0.8", "cache-control": "max-age=0"}};
    DefaultManhwa.Source = 'Reaperscans'
    let dom!: HTMLElement;
    let manhwa: HTMLElement | any;
    let manhwas: HTMLCollectionOf<Element>;
    let i: number = 0;
    let page: number = 1;
    let manhwa_not_updated: boolean = true;
    let LAST_UPDATE_MANHWA: any = null;
    let time_constant = 15;
    await last_manhwa_updated(DefaultManhwa.Source)
    .then(data => {
        if (data !== null) 
            {
                LAST_UPDATE_MANHWA = data;
            }
        }
    )
    .catch(err => console.log("LASTTTTT"))

    while (manhwa_not_updated) {
        await axios.get(`https://reaperscans.com/latest/comics?page=${page}`,config)
        .then(res => { dom = parser.parseFromString(res.data) })
        .catch(error => console.log("weird error when getting page",error))
        
        manhwas = dom.getElementsByClassName('grid');
        manhwas = manhwas[0].getElementsByClassName('transition');
        if (manhwas.length === 0) {
            manhwa_not_updated = false;
            break
        }

        while (manhwas.length !== i && manhwa_not_updated) {
            const manhwaCalls = await limiter.removeTokens(1);
            manhwa = manhwas[i];
            let data: ManhwaT = DefaultManhwa; 

            await reaper_data_update(manhwa,time_constant)
            .then(update_data => data = update_data)
            .catch(err => console.log("ERROR IN RETRIEVING DATA FROM FUNCTION REAPER_GET_DATA"))
            time_constant += 10;

            if (LAST_UPDATE_MANHWA !== null && data.Name === LAST_UPDATE_MANHWA.Name && data.Chapter == LAST_UPDATE_MANHWA.Chapter) {
                manhwa_not_updated = false
                break;
            }
            console.log(data.Name);
            await manhwa_update(data)
            data.Genres = []
            i += 1;
        }

        console.log("REAPER",page,i)
        i = 0;
        page += 1;
    }
}