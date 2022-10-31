var DomParser = require('dom-parser');
var parser = new DomParser();
import { DefaultManhwa, ManhwaT } from '../Types'
import { last_manhwa_updated, manhwa_update } from '../DB_functions'
const axios = require('axios')

const reaper_data_update = async (manhwa): Promise<ManhwaT> => {
    
    let data: ManhwaT = DefaultManhwa;
    data.Link = manhwa.getElementsByClassName('flex-shrink-0')[0].getElementsByTagName('a')[0].attributes[0].value;
    data.Name = manhwa.getElementsByClassName('flex-shrink-0')[0].getElementsByTagName('a')[0].getElementsByTagName('img')[0].attributes[2].value;
    data.Image = manhwa.getElementsByClassName('flex-shrink-0')[0].getElementsByTagName('a')[0].getElementsByTagName('img')[0].attributes[1].value;

    let release;
    await axios.get(manhwa.getElementsByClassName('flex-shrink-0')[0].getElementsByTagName('a')[0].attributes[0].value)
    .then(res => release = parser.parseFromString(res.data))
    .catch(error => console.log("FAILED TO FETCH DATA FROM LINK REAPER SCANS"))
    
    data.Status = release.getElementsByTagName('dl')[0].getElementsByTagName('div')[1].getElementsByTagName('dd')[0].textContent;
    

    console.log('Chapter: ', release.getElementsByTagName('ul')[0].getElementsByTagName('p')[0].textContent);
    console.log('Modified: ', release.getElementsByTagName('ul')[0].getElementsByTagName('p')[1].textContent);
    data.Modified = release.getElementsByTagName('time')[1].attributes[1].value;
        
    return new Promise((resolve,reject) => { resolve(data) })
}

export const reaper_update = async () => {
    DefaultManhwa.Source = 'Reaperscans'
    let dom!: HTMLElement;
    let manhwa: HTMLElement | any;
    let manhwas: HTMLCollectionOf<Element>;
    let i: number = 0;
    let page: number = 1;
    let manhwa_not_updated: boolean = true;
    let LAST_UPDATE_MANHWA: any = null;

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
        await axios.get(`https://reaperscans.com/latest/comics?page=${page}`)
        .then(res => { dom = parser.parseFromString(res.data) })
        .catch(error => console.log(error))
        
        manhwas = dom.getElementsByClassName('grid');
        if (manhwas.length === 0)
            break
        manhwas = manhwas[0].getElementsByClassName('transition');
        console.log("MANHWA AMOUNT: ",manhwas.length);
        while (manhwas.length !== i && manhwa_not_updated) {
            manhwa = manhwas[i];
            let data: ManhwaT = DefaultManhwa; 

            await reaper_data_update(manhwa)
            .then(update_data => data = update_data)
            .catch(err => console.log("ERROR IN RETRIEVING DATA FROM FUNCTION REAPER_GET_DATA"))

            if (LAST_UPDATE_MANHWA !== null && data.Name === LAST_UPDATE_MANHWA.Name && data.Chapter == LAST_UPDATE_MANHWA.Chapter) {
                manhwa_not_updated = false
                break;
            }

            await manhwa_update(data)
            data.Genres = []
            i += 1;
        }

        console.log("REAPER",page,i)
        i = 0;
        page += 1;
    }
}