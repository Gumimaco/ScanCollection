var DomParser = require('dom-parser');
var parser = new DomParser();
import { DefaultManhwa, ManhwaT } from '../Types'
import { last_manhwa_updated, manhwa_update } from '../DB_functions'
const axios = require('axios')

const asura_data_update = async (manhwa): Promise<ManhwaT> => {
    let data: ManhwaT = DefaultManhwa;
    data.Name = manhwa.getElementsByTagName('a')[0].attributes[1].value;
    data.Link = manhwa.getElementsByTagName('a')[0].attributes[0].value;
    data.Image = manhwa.getElementsByTagName('img')[0].attributes[0].value;

    let release;

    await axios.get(manhwa.getElementsByTagName('a')[0].attributes[0].value)
    .then(res => release = parser.parseFromString(res.data))
    .catch(error => console.log("FAILED TO FETCH DATA FROM LINK IN ASURA_DATA_UPDATE"))
    
    data.Status = release.getElementsByClassName('imptdt')[0].getElementsByTagName('i')[0].innerHTML
    if (typeof(data.Status) !== 'undefined') {
        data.Modified = release.getElementsByTagName('time')[1].attributes[1].value;
        data.Chapter = Number(release.getElementsByClassName('epcurlast')[0].innerHTML.split(' ')[1])
        data.Rating = Number(release.getElementsByClassName('num')[0].innerHTML);
        if (isNaN(data.Chapter)) {
            data.Chapter = 0
        }
        if (isNaN(data.Rating)) {
            data.Rating = 0
        }
        if (release.getElementsByClassName('mgen').length) {
            release.getElementsByClassName('mgen')[0].getElementsByTagName('a').forEach(genre => {
                data.Genres.push(genre.innerHTML)
            })
        }
    }
    return new Promise((resolve,reject) => { resolve(data) })
}

export const asura_update = async () => {
    DefaultManhwa.Source = 'Asurascans'
    let dom!: HTMLElement;
    let manhwa: HTMLElement;
    let manhwas: HTMLCollectionOf<Element>;
    let i: number = 0;
    let page: number = 1;
    let manhwa_not_updated: boolean = true;
    let LAST_UPDATE_MANHWA_NAME: string = "Default";

    await last_manhwa_updated(DefaultManhwa.Source)
    .then(data => LAST_UPDATE_MANHWA_NAME = data)
    .catch(err => console.log("LASTTTTT"))

    while (manhwa_not_updated) {
        await axios.get(`https://www.asurascans.com/manga/?page=${page}&status=&type=&order=update`)
        .then(res => { dom = parser.parseFromString(res.data) })
        .catch(error => console.log(error))
        
        manhwas = dom.getElementsByClassName('bsx');
        if (manhwas.length === 0)
            break
        while (manhwas.length !== i && manhwa_not_updated) {
            manhwa = parser.parseFromString(manhwas[i].innerHTML);
            let data: ManhwaT = DefaultManhwa; 

            await asura_data_update(manhwa)
            .then(update_data => data = update_data)
            .catch(err => console.log("ERROR IN RETRIEVING DATA FROM FUNCTION ASURA_GET_DATA"))
            // console.log(data.name,"---", LAST_UPDATE_MANHWA_NAME)

            if (data.Name === LAST_UPDATE_MANHWA_NAME) {
                manhwa_not_updated = false
                break;
            }

            await manhwa_update(data)
            data.Genres = []
            i += 1;
        }

        console.log("ASURA",page,i)
        i = 0;
        page += 1;
    }
}