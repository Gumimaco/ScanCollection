var DomParser = require('dom-parser');
var parser = new DomParser();
import { DefaultManhwa, ManhwaT } from '../Types'
import { genre_insert, last_manhwa_updated, manhwa_update } from '../DB_functions'
const axios = require('axios')

const leviathan_update_data = async (manhwa,date = new Date()): Promise<ManhwaT> => {
    let data: ManhwaT = DefaultManhwa;
    data.name = manhwa.getElementsByTagName('a')[0].attributes[1].value;
    data.link = manhwa.getElementsByTagName('a')[0].attributes[0].value;
    data.image = manhwa.getElementsByTagName('img')[0].attributes[0].value;
    if (data.name === "Join our new discord server!") {
        return new Promise((res,rej) => {rej('error')})
    }
    let release;
    await axios.get(manhwa.getElementsByTagName('a')[0].attributes[0].value)
    .then(res => release = parser.parseFromString(res.data))
    .catch(error => console.log("error while going to the link"))

    data.status = release.getElementsByClassName('imptdt')[0].getElementsByTagName('i')[0].innerHTML;
    if (typeof(data.status) !== 'undefined' && data.status !== 'Coming Soon!') {
        // if (date.getDate() === new Date(release.getElementsByClassName('chapterdate')[0].innerHTML).getDate()) {
        //     data.update = date.toISOString()
        // } else {
        //     data.update = new Date(`${release.getElementsByClassName('chapterdate')[0].innerHTML} UTC`).toISOString()
        // }
        data.chapter = Number(release.getElementsByClassName('epcurlast')[0].innerHTML.split(' ')[1])
        data.rating = Number(release.getElementsByClassName('numscore')[0].innerHTML);
        if (isNaN(data.chapter)) {
            data.chapter = 0
        }
        if (isNaN(data.rating)) {
            data.rating = 0
        }
        if (release.getElementsByClassName('mgen').length) {
            release.getElementsByClassName('mgen')[0].getElementsByTagName('a').forEach(genre => {
                data.genres.push(genre.innerHTML)
            })
        }
    }
    console.log(data)
    return new Promise((resolve,reject) => { resolve(data) })
}

const leviathan_update = async () => {
    DefaultManhwa.source = 'Leviathan'
    let dom!: HTMLElement;
    let manhwa: HTMLElement;
    let manhwas: HTMLCollectionOf<Element>;
    let i: number = 0;
    let page: number = 1;
    let manhwa_not_updated: boolean = true;
    let LAST_UPDATE_MANHWA_NAME: string = "Default";
    let current_date = new Date();

    await last_manhwa_updated(DefaultManhwa.source)
    .then(res => LAST_UPDATE_MANHWA_NAME = res)
    .catch(error => console.log('error with last manhwa updated'))
    
    while (manhwa_not_updated) {
        await axios.get(`https://luminousscans.com/series/?page=${page}&order=update?2022-09-19`)
        .then(res => { dom = parser.parseFromString(res.data) })
        .catch(error => console.log(error))
        
        manhwas = dom.getElementsByClassName('bsx');
        if (manhwas.length === 0)
            break
        while (manhwas.length !== i && manhwa_not_updated) {
            manhwa = parser.parseFromString(manhwas[i].innerHTML);
            let data: ManhwaT = DefaultManhwa; 
            current_date.setSeconds(current_date.getSeconds() - (page+1))
    
            await leviathan_update_data(manhwa,current_date)
            .then(update_data => data = update_data)
            .catch(err => console.log("ERROR IN RETRIEVING DATA FROM FUNCTION FLAME_GET_DATA",err))
            console.log(data.name,"---", LAST_UPDATE_MANHWA_NAME)
        
            if (data.name === LAST_UPDATE_MANHWA_NAME) {
                manhwa_not_updated = false
                break;
            }   

            // await manhwa_update(data)
            data.genres = []
            i += 1;
        }
        console.log("FLAME",page,i)
        i = 0;
        page += 1;
    }
}
leviathan_update()
module.exports = leviathan_update