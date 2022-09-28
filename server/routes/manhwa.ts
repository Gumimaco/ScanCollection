import { get_page_sort_by_modified, get_all_manhwas, get_all_genres, THE_QUERY_RESOLVER } from '../comics/DB_functions'
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

    console.log('Making query request1');
    console.log(req.query);
    await THE_QUERY_RESOLVER(req.query)
    .then(manhwas => res.send(manhwas))
    .catch(error => res.send("ERROR FROM QUERY"))
    
})


module.exports = router