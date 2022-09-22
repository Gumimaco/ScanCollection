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
var DomParser = require('dom-parser');
var parser = new DomParser();
var Types_1 = require("../Types");
var DB_functions_1 = require("../DB_functions");
var axios = require('axios');
var asura_data_daily = function (manhwa) { return __awaiter(void 0, void 0, void 0, function () {
    var data, release;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = Types_1.DefaultManhwa;
                data.name = manhwa.getElementsByTagName('a')[0].attributes[1].value;
                data.link = manhwa.getElementsByTagName('a')[0].attributes[0].value;
                data.image = manhwa.getElementsByTagName('img')[0].attributes[0].value;
                return [4 /*yield*/, axios.get(manhwa.getElementsByTagName('a')[0].attributes[0].value)
                        .then(function (res) { return release = parser.parseFromString(res.data); })["catch"](function (error) { return console.log("error while going to the link"); })];
            case 1:
                _a.sent();
                data.status = release.getElementsByClassName('imptdt')[0].getElementsByTagName('i')[0].innerHTML;
                if (typeof (data.status) !== 'undefined') {
                    data.update = release.getElementsByTagName('time')[1].attributes[1].value;
                    data.chapter = Number(release.getElementsByClassName('epcurlast')[0].innerHTML.split(' ')[1]);
                    data.rating = Number(release.getElementsByClassName('num')[0].innerHTML);
                    if (isNaN(data.chapter)) {
                        data.chapter = 0;
                    }
                    if (isNaN(data.rating)) {
                        data.rating = 0;
                    }
                    if (release.getElementsByClassName('mgen').length) {
                        release.getElementsByClassName('mgen')[0].getElementsByTagName('a').forEach(function (genre) {
                            data.genres.push(genre.innerHTML);
                        });
                    }
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { resolve(data); })];
        }
    });
}); };
var asura_daily = function () { return __awaiter(void 0, void 0, void 0, function () {
    var dom, manhwa, manhwas, i, page, manhwa_count, _loop_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                Types_1.DefaultManhwa.source = 'Asurascans';
                i = 0;
                page = 1;
                manhwa_count = 1;
                _a.label = 1;
            case 1:
                if (!(manhwa_count !== 0)) return [3 /*break*/, 6];
                return [4 /*yield*/, axios.get("https://www.asurascans.com/manga/?page=".concat(page, "&status=&type=&order=update"))
                        .then(function (res) { dom = parser.parseFromString(res.data); })["catch"](function (error) { return console.log("failed to get the DOMAIN page"); })];
            case 2:
                _a.sent();
                manhwas = dom.getElementsByClassName('bsx');
                manhwa_count = manhwas.length;
                _loop_1 = function () {
                    var data;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                manhwa = parser.parseFromString(manhwas[i].innerHTML);
                                data = Types_1.DefaultManhwa;
                                return [4 /*yield*/, asura_data_daily(manhwa)
                                        .then(function (res_data) { data = res_data; })["catch"](function (err) { return console.log("error with getting data from asura_data_daily"); })];
                            case 1:
                                _b.sent();
                                (0, DB_functions_1.manhwa_insert)(data);
                                data.genres = [];
                                i += 1;
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 3;
            case 3:
                if (!(manhwas.length !== i)) return [3 /*break*/, 5];
                return [5 /*yield**/, _loop_1()];
            case 4:
                _a.sent();
                return [3 /*break*/, 3];
            case 5:
                console.log("ASURA", page, i);
                i = 0;
                page += 1;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}); };
asura_daily();
module.exports = asura_daily;
