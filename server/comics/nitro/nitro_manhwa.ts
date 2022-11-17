import puppeteer from 'puppeteer';
import { DefaultManhwa, ManhwaT } from '../Types'
import { genre_insert, last_manhwa_updated, manhwa_update } from '../DB_functions'
var DomParser = require('dom-parser');
var parser = new DomParser();
const axios = require('axios')

const month_translate = {
    'January': '01',
    'February': '02',
    'March': '03',
    'April': '04',
    'May': '05',
    'June': '06',
    'July': '07',
    'August': '08',
    'September': '09',
    'October': '10',
    'November': '11',
    'December': '12'
}
const date_convert = (upload_date: string,constant: number): string => {
    let day = upload_date.split(',')[0].split(' ')[1].replace(/\s/g, "")
    let month = month_translate[upload_date.split(',')[0].split(' ')[0].replace(/\s/g, "")]
    let year = upload_date.split(',')[1].replace(/\s/g, "")
    let date = new Date(`${year}-${month}-${day}`);
    date.setSeconds(date.getSeconds() - constant);
    return date.toISOString()
}

const time_convert = (time: string, constant: number): string => {
    let now = new Date();
    let find = /\d+/;
    let amount_of_time: number = Number(time.match(find)![0]);
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

const nitro_update = (manhwa,seconds): Promise<ManhwaT> => {
    return new Promise(async (resolve,reject) => {

        let data: ManhwaT = DefaultManhwa;
        if (manhwa.getElementsByClassName('img-responsive').length === 0) {
            reject(false);
            return;
        }
        data.Name = manhwa.getElementsByTagName('a')[0].attributes[1].value;
        data.Link = manhwa.getElementsByTagName('a')[0].attributes[0].value;
        data.Image = manhwa.getElementsByTagName('img')[0].attributes[2].value;

        
        let last_chapter = manhwa.getElementsByClassName('chapter-item')[0]
        let find = /\d+/;
        data.Chapter = Number(last_chapter.getElementsByTagName('a')[0].innerHTML.match(find)[0])

        if (last_chapter.getElementsByTagName('a').length === 2) {
            data.Modified = time_convert(last_chapter.getElementsByTagName('a')[1].attributes[1].value,seconds)
        } else {
            data.Modified = date_convert(last_chapter.getElementsByClassName('post-on')[0].innerHTML,seconds);
        }


        let release;
        await axios.get(data.Link)
        .then(res => release = parser.parseFromString(res.data))
        .catch(error => console.log(data.Link, "error while going to the link"))
        
        data.Status = release.getElementsByClassName('post-content_item')[8].getElementsByClassName('summary-content')[0].innerHTML;
        let genres = release.getElementsByClassName('post-content_item')[5]
        if (genres.length !== 0) {
            genres.getElementsByTagName('a').forEach(manhwa =>{
                data.Genres.push(manhwa.innerHTML);
            })
        }
        data.Rating = release.getElementsByClassName('score')[0].innerHTML;
        resolve(data)
        
    })
}
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

export const nitro_manhwa = async () => {
    return new Promise( async (resolve,reject) => {
        let dom: any = null;
        DefaultManhwa.Source = 'Nitroscans'
        let manhwas: Element[] = [];
        let i: number = 1;
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
        .catch(err => resolve(true))
        

        const browser = await puppeteer.launch();
        const w_page = await browser.newPage();

        await w_page.goto('https://nitroscans.com/manga-genre/manhwa/?m_orderby=latest');

        await w_page.waitForSelector('#navigation-ajax')

        do {

            let html = await w_page.content();
            dom = parser.parseFromString(html);
            let new_amount = dom.getElementsByClassName('col-12');
            

            if (manhwas.length === new_amount.length) {
                manhwa_not_updated = false;
                break;
            }

            manhwas = new_amount;

            for (;i < manhwas.length;i++) {
                let data;
                let should_skip = false;
                await nitro_update(manhwas[i],time_constant)
                .then(output_data => data = output_data)
                .catch(error => should_skip = true)
                time_constant += 10;
                if (should_skip) {
                    console.log("SKIPPING",i)
                    continue;
                }
                if (LAST_UPDATE_MANHWA !== null && data.Name === LAST_UPDATE_MANHWA.Name && data.Chapter == LAST_UPDATE_MANHWA.Chapter) {
                    manhwa_not_updated = false
                    break;
                }
                await manhwa_update(data);
                data.Genres = [];
            }

            await w_page.evaluate(() => {
                let button = document.querySelector('#navigation-ajax') as HTMLElement | null
                button?.click();
            });
            await delay(7000)
            
        } while (manhwa_not_updated);

        console.log("Nitro Manhwa succesfull ending")
        browser.close();
        resolve(true);
    })
}
