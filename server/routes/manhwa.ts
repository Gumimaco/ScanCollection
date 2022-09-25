import { get_page_sort_by_modified, get_all_manhwas, get_all_genres } from '../comics/DB_functions'
import { ManhwaT } from '../comics/Types'
const {Router} = require('express')
const router = Router()

router.get('/all',async (req,res) => {
    let data_obj: {manhwas: ManhwaT[],genres: {Name:string,Source:string,Genre:string}[]}= {
        manhwas: [],
        genres: [],
    }
    await get_all_manhwas()
    .then(man => data_obj.manhwas = man )
    .catch(error => res.send('ERROR'))
    
    await get_all_genres()
    .then(genres => data_obj.genres = genres)
    .catch(error => res.send("ERROR"))

    res.send(data_obj);
})

router.get('/?',async (req,res) => {
    
    let current_manhwas: ManhwaT;
    if (typeof(req.query['page']) !== "undefined") {
        get_page_sort_by_modified(req.query['page'])
        .then(manhwas => {res.send(manhwas)})
        .catch(error => {console.log('got error');res.send("ERROR")})
    }
    
})


module.exports = router