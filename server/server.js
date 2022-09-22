"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var cors = require('cors');
var manhwa = require('./routes/manhwa');
var PORT = process.env.PORT || 5001;
var HALF_HOUR_MS = 1800000;
var DAY_MS = 86400000;
var app = express();
app.use(cors());
// const f = async () => {
//     console.log('f Minute Update')
//     await ASURA_COMICS_UPDATE()
//     await FLAME_COMICS_UPDATE()
//     await TOONILY_COMICS_UPDATE()
// }
app.use('/manhwa', manhwa);
app.listen(PORT, function (req, res) {
    console.log("Listening on port ", PORT);
});
