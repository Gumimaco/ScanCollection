"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var asura_update_1 = require("./comics/asura/asura_update");
// import { flame_update as FLAME_COMICS_UPDATE } from './comics/flame/flame_update';
var toonily_update_1 = require("./comics/toonily/toonily_update");
var nitro_manhwa_1 = require("./comics/nitro/nitro_manhwa");
var nitro_manhua_1 = require("./comics/nitro/nitro_manhua");
var manhwa_1 = require("./routes/manhwa");
var express = require("express");
var PORT = process.env.PORT || 5001;
var HALF_HOUR_MS = 1800000;
var DAY_MS = 86400000;
var app = express();
var f = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('f Minute Update');
                return [4 /*yield*/, (0, asura_update_1.asura_update)()
                        .then(function (r) { return console.log('succesfull asura_update'); })["catch"](function (error) { return console.log('error asura_update', error); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, toonily_update_1.toonily_update)()
                        .then(function (r) { return console.log('succesfull toonily_update'); })["catch"](function (error) { return console.log('error toonily_update', error); })];
            case 2:
                _a.sent();
                (0, nitro_manhwa_1.nitro_manhwa)();
                (0, nitro_manhua_1.nitro_manhua)();
                return [2 /*return*/];
        }
    });
}); };
f();
setInterval(f, HALF_HOUR_MS);
app.use('/manhwa', manhwa_1.router);
app.listen(PORT, function (req, res) {
    console.log("Listening on port ", PORT);
});