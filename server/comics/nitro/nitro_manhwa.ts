import puppeteer from 'puppeteer';
import { DefaultManhwa, ManhwaT } from '../Types'
import { genre_insert, last_manhwa_updated, manhwa_update } from '../DB_functions'
var DomParser = require('dom-parser');
var parser = new DomParser();
const axios = require('axios')

const nitro_update = (manhwa,seconds): Promise<ManhwaT> => {
    return new Promise(async (resolve,reject) => {

        let data: ManhwaT = DefaultManhwa;
        data.Name = manhwa.getElementsByTagName('a')[0].attributes[1].value;
        data.Link = manhwa.getElementsByTagName('a')[0].attributes[0].value;
        data.Image = manhwa.getElementsByTagName('img')[0].attributes[2].value;

        let release;
        await axios.get(data.Link)
        .then(res => release = parser.parseFromString(res.data))
        .catch(error => console.log("error while going to the link"))

        let last_chapter = manhwa.getElementsByClassName('chapter-item')[0]

        console.log(last_chapter.getElementsByTagName('a'))
        
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
        console.log("waiting")
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
        let current_seconds = 10;
    
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

        await w_page.goto('https://nitroscans.com/manga-genre/manhwa/');

        await w_page.waitForSelector('#navigation-ajax')
        
        do {

            let html = await w_page.content();
            dom = parser.parseFromString(html);

            if (manhwas.length === dom.getElementsByClassName('col-12')) {
                break;
            }
            manhwas = dom.getElementsByClassName('col-12');
            
            for (;i < manhwas.length;i++) {
                let data;
                await nitro_update(manhwas[i],current_seconds)
                .then(output_data => data = output_data)
                .catch(error => reject(error))
                // if (LAST_UPDATE_MANHWA !== null && data.Name === LAST_UPDATE_MANHWA.Name && data.Chapter == LAST_UPDATE_MANHWA.Chapter) {
                //     manhwa_not_updated = false
                //     break;
                // }
                // manhwa_update(data);
                data.Genres = [];
            }

            await w_page.evaluate(() => {
                let button = document.querySelector('#navigation-ajax') as HTMLElement | null
                button?.click();
            });

            await delay(4000);
            
        } while (manhwa_not_updated);
        console.log("Nitro Manhwa succesfull ending")
        browser.close();
        resolve(true);
    })
}
