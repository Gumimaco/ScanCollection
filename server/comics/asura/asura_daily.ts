var DomParser = require('dom-parser');
var parser = new DomParser();
import { DefaultManhwa, ManhwaT } from '../Types'
import { manhwa_insert } from '../DB_functions'
const axios = require('axios')

const asura_data_daily = async (manhwa): Promise<ManhwaT> => {
    let data: ManhwaT = DefaultManhwa;
    data.name = manhwa.getElementsByTagName('a')[0].attributes[1].value;
    data.link = manhwa.getElementsByTagName('a')[0].attributes[0].value;
    data.image = manhwa.getElementsByTagName('img')[0].attributes[0].value;
    
    let release;
    await axios.get(manhwa.getElementsByTagName('a')[0].attributes[0].value)
    .then(res => release = parser.parseFromString(res.data))
    .catch(error => console.log("error while going to the link"))

    data.status = release.getElementsByClassName('imptdt')[0].getElementsByTagName('i')[0].innerHTML;
    if (typeof(data.status) !== 'undefined') {
        data.update = release.getElementsByTagName('time')[1].attributes[1].value;
        data.chapter = Number(release.getElementsByClassName('epcurlast')[0].innerHTML.split(' ')[1])
        data.rating = Number(release.getElementsByClassName('num')[0].innerHTML);
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
    return new Promise((resolve,reject) => { resolve(data) })
}


const asura_daily = async () => {
    DefaultManhwa.source = 'Asurascans'
    let dom!: HTMLElement;
    let manhwa: HTMLElement;
    let manhwas: HTMLCollectionOf<Element>;
    let i: number = 0;
    let page: number = 1;
    let manhwa_count: number = 1;

    while (manhwa_count !== 0) {
        await axios.get(`https://www.asurascans.com/manga/?page=${page}&status=&type=&order=update`)
        .then(res => { dom = parser.parseFromString(res.data) })
        .catch(error => console.log("failed to get the DOMAIN page"))
        
        manhwas = dom.getElementsByClassName('bsx');
        manhwa_count = manhwas.length;
    
        while (manhwas.length !== i) {

            manhwa = parser.parseFromString(manhwas[i].innerHTML);
            let data: ManhwaT = DefaultManhwa;
            await asura_data_daily(manhwa)
            .then(res_data => { data = res_data })
            .catch(err => console.log("error with getting data from asura_data_daily"))

            manhwa_insert(data);
            data.genres = []
            i += 1;
        }
        console.log("ASURA",page,i)
        i = 0;
        page += 1;
    }
}
asura_daily();
module.exports = asura_daily