var DomParser = require('dom-parser');
var parser = new DomParser();
import { DefaultManhwa, ManhwaT } from '../Types'
import { last_manhwa_updated, manhwa_update } from '../DB_functions'
const axios = require('axios')

const month_translate = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
}


const toonily_data_update = async (manhwa,date = new Date()): Promise<ManhwaT> => {
    let data: ManhwaT = DefaultManhwa;
    data.Name = manhwa.getElementsByTagName('a')[0].attributes[1].value;
    data.Link = manhwa.getElementsByTagName('a')[0].attributes[0].value;
    data.Image = manhwa.getElementsByTagName('a')[0].childNodes[1].attributes[2].value;
    let release;
    await axios.get(manhwa.getElementsByTagName('a')[0].attributes[0].value)
    .then(res => release = parser.parseFromString(res.data))
    .catch(error => console.log("error while going to the link"))
    
    data.Status = release.getElementsByClassName('summary-content').at(-1).innerHTML;
    if (typeof(data.Status) !== 'undefined' && data.Status !== 'Coming Soon!') {
        if (release.getElementsByClassName('upicn').length === 0) {
            let web_date = release.getElementsByClassName('chapter-release-date')[0].getElementsByTagName('i')[0].innerHTML
            
            if (typeof(web_date) === 'undefined') {
                data.Modified = "UNDEFINED"
            } else if (web_date === "1 day ago") {
                let day = new Date(date.getTime())
                day.setDate(day.getDate() - 1)
                data.Modified = day.toISOString()
            } else if (web_date === "2 days ago") {
                let day = new Date(date.getTime())
                day.setDate(day.getDate() - 2)
                data.Modified = day.toISOString()
            } else if (web_date === "3 days ago") {
                let day = new Date(date.getTime())
                day.setDate(day.getDate() - 3)
                data.Modified = day.toISOString()
            }
            else {
                let year = '20' + web_date.split(',')[1].split(' ')[1];
                let month = month_translate[web_date.split(' ')[0]]
                let day = web_date.split(' ')[1].split(',')[0]
                let final = `${year}/${month}/${day} UTC`  
                data.Modified = new Date(final).toISOString()
            }
        } else {
            data.Modified = date.toISOString()
        }
        
        data.Chapter = Number(release.getElementsByClassName('wp-manga-chapter')[0].getElementsByTagName('a')[0].innerHTML.split(' ')[1])
        data.Rating = Number(release.getElementsByClassName('score')[0].innerHTML);
        if (isNaN(data.Chapter)) {
            data.Chapter = 0
        }
        if (isNaN(data.Rating)) {
            data.Rating = 0
        }

        if (release.getElementsByClassName('genres-content')[0].getElementsByTagName('a').length) {
            release.getElementsByClassName('genres-content')[0].getElementsByTagName('a').forEach(genre => {
                data.Genres.push(genre.innerHTML)
            })
        }
    }
    return new Promise((resolve,reject) => { resolve(data) })
}

export const toonily_update = async () => {
    return new Promise(async (resolve,reject) => {
        DefaultManhwa.Source = 'Toonily'
        let dom!: HTMLElement;
        let manhwa: HTMLElement;
        let manhwas: HTMLCollectionOf<Element>;
        let i: number = 0;
        let page: number = 1;
        let manhwa_not_updated: boolean = true;
        let LAST_UPDATE_MANHWA: any = null;
        let current_date = new Date();

        await last_manhwa_updated(DefaultManhwa.Source)
        .then(data => {
            if (data !== null) 
                {
                    LAST_UPDATE_MANHWA = data;
                }
            }
        )
        
        while (manhwa_not_updated) {
            await axios.get(`https://toonily.com/search/page/${page}/?m_orderby=latest`)
            .then(res => { dom = parser.parseFromString(res.data) })
            .catch(error => reject(error))
            
            manhwas = dom.getElementsByClassName('page-item-detail');

            if (manhwas.length === 0)
                break
            while (manhwas.length !== i && manhwa_not_updated) {
                manhwa = parser.parseFromString(manhwas[i].innerHTML);
                let data: ManhwaT = DefaultManhwa; 
                current_date.setSeconds(current_date.getSeconds() - (page+1))
        
                await toonily_data_update(manhwa,current_date)
                .then(update_data => data = update_data)
                .catch(err => reject(err))
                // console.log(data.name,"---", LAST_UPDATE_MANHWA_NAME)
            
                if (LAST_UPDATE_MANHWA !== null && data.Name === LAST_UPDATE_MANHWA.Name && data.Chapter == LAST_UPDATE_MANHWA.Chapter) {
                    manhwa_not_updated = false
                    break;
                }   

                await manhwa_update(data)
                data.Genres = []
                i += 1;
            }
            console.log("TOONILY",page,i)
            i = 0;
            page += 1;
        }      
        resolve(true)
    })
}