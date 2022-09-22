import { get_all_manhwas } from '../comics/DB_functions'
const {Router} = require('express')
const router = Router()

router.get('/?',async (req,res) => {
    console.log(req.query)
    get_all_manhwas()
    .then(manhwas => {res.send(manhwas)})
    .catch(error => {console.log('got error');res.send("ERROR")})
})

module.exports = router