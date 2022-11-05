import { asura_update as ASURA_COMICS_UPDATE } from './comics/asura/asura_update';
// import { flame_update as FLAME_COMICS_UPDATE } from './comics/flame/flame_update';
import { toonily_update as TOONILY_COMICS_UPDATE } from './comics/toonily/toonily_update';
import { reaper_update as REAPER_COMICS_UPDATE } from './comics/reaper/reaper_update';

const express = require("express")
const path = require("path")
const cors = require('cors')
const manhwa = require('./routes/manhwa')

const PORT = process.env.PORT || 5001;
const HALF_HOUR_MS: number = 1800000;
const DAY_MS: number = 86400000;
const app = express();
app.use(cors());

const f = async () => {
    
    console.log('f Minute Update')
    await ASURA_COMICS_UPDATE()
    .then(r => console.log('succesfull asura_update'))
    .catch(error => console.log('error asura_update',error));

    // await FLAME_COMICS_UPDATE()
    // .then(r => console.log('succesfull flame_update'))
    // .catch(error => console.log('error flame_update',error));
    await TOONILY_COMICS_UPDATE()
    .then(r => console.log('succesfull toonily_update'))
    .catch(error => console.log('error toonily_update',error));

    await REAPER_COMICS_UPDATE()
    .then(r => console.log('succesfull reaper_scans'))
    .catch(error => console.log('error reaper_scans',error));
}
f()

setInterval(f,HALF_HOUR_MS)
app.use('/manhwa',manhwa)
app.listen(PORT,(req,res) => {
    console.log("Listening on port ",PORT)
})