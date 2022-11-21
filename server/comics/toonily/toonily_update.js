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
exports.toonily_update = void 0;
var DomParser = require('dom-parser');
var parser = new DomParser();
var Types_1 = require("../Types");
var DB_functions_1 = require("../DB_functions");
var axios = require('axios');
var month_translate = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
};
var toonily_data_update = function (manhwa, date) {
    if (date === void 0) { date = new Date(); }
    return __awaiter(void 0, void 0, void 0, function () {
        var data, release, web_date, day, day, day, year, month, day, final;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = Types_1.DefaultManhwa;
                    data.Name = manhwa.getElementsByTagName('a')[0].attributes[1].value.replace(/&#8217;/g, "'");
                    data.Link = manhwa.getElementsByTagName('a')[0].attributes[0].value;
                    data.Image = manhwa.getElementsByTagName('a')[0].childNodes[1].attributes[2].value;
                    return [4 /*yield*/, axios.get(manhwa.getElementsByTagName('a')[0].attributes[0].value)
                            .then(function (res) { return release = parser.parseFromString(res.data); })["catch"](function (error) { return console.log("error while going to the link"); })];
                case 1:
                    _a.sent();
                    data.Status = release.getElementsByClassName('summary-content').at(-1).innerHTML;
                    if (typeof (data.Status) !== 'undefined' && data.Status !== 'Coming Soon!') {
                        if (release.getElementsByClassName('upicn').length === 0) {
                            web_date = release.getElementsByClassName('chapter-release-date')[0].getElementsByTagName('i')[0].innerHTML;
                            if (typeof (web_date) === 'undefined') {
                                data.Modified = "UNDEFINED";
                            }
                            else if (web_date === "1 day ago") {
                                day = new Date(date.getTime());
                                day.setDate(day.getDate() - 1);
                                data.Modified = day.toISOString();
                            }
                            else if (web_date === "2 days ago") {
                                day = new Date(date.getTime());
                                day.setDate(day.getDate() - 2);
                                data.Modified = day.toISOString();
                            }
                            else if (web_date === "3 days ago") {
                                day = new Date(date.getTime());
                                day.setDate(day.getDate() - 3);
                                data.Modified = day.toISOString();
                            }
                            else {
                                year = '20' + web_date.split(',')[1].split(' ')[1];
                                month = month_translate[web_date.split(' ')[0]];
                                day = web_date.split(' ')[1].split(',')[0];
                                final = "".concat(year, "/").concat(month, "/").concat(day, " UTC");
                                data.Modified = new Date(final).toISOString();
                            }
                        }
                        else {
                            data.Modified = date.toISOString();
                        }
                        data.Chapter = Number(release.getElementsByClassName('wp-manga-chapter')[0].getElementsByTagName('a')[0].innerHTML.split(' ')[1]);
                        data.Rating = Number(release.getElementsByClassName('score')[0].innerHTML);
                        if (isNaN(data.Chapter)) {
                            data.Chapter = 0;
                        }
                        if (isNaN(data.Rating)) {
                            data.Rating = 0;
                        }
                        if (release.getElementsByClassName('genres-content')[0].getElementsByTagName('a').length) {
                            release.getElementsByClassName('genres-content')[0].getElementsByTagName('a').forEach(function (genre) {
                                data.Genres.push(genre.innerHTML);
                            });
                        }
                    }
                    return [2 /*return*/, new Promise(function (resolve, reject) { resolve(data); })];
            }
        });
    });
};
var toonily_update = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var dom, manhwa, manhwas, i, page, manhwa_not_updated, LAST_UPDATE_MANHWA, current_date, _loop_1, state_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Types_1.DefaultManhwa.Source = 'Toonily';
                            i = 0;
                            page = 1;
                            manhwa_not_updated = true;
                            LAST_UPDATE_MANHWA = null;
                            current_date = new Date();
                            return [4 /*yield*/, (0, DB_functions_1.last_manhwa_updated)(Types_1.DefaultManhwa.Source)
                                    .then(function (data) {
                                    if (data !== null) {
                                        LAST_UPDATE_MANHWA = data;
                                    }
                                })];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            if (!manhwa_not_updated) return [3 /*break*/, 7];
                            return [4 /*yield*/, axios.get("https://toonily.com/search/page/".concat(page, "/?m_orderby=latest"))
                                    .then(function (res) { dom = parser.parseFromString(res.data); })["catch"](function (error) { return reject(error); })];
                        case 3:
                            _a.sent();
                            manhwas = dom.getElementsByClassName('page-item-detail');
                            if (manhwas.length === 0)
                                return [3 /*break*/, 7];
                            _loop_1 = function () {
                                var data;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            manhwa = parser.parseFromString(manhwas[i].innerHTML);
                                            data = Types_1.DefaultManhwa;
                                            current_date.setSeconds(current_date.getSeconds() - (page + 1));
                                            return [4 /*yield*/, toonily_data_update(manhwa, current_date)
                                                    .then(function (update_data) { return data = update_data; })["catch"](function (err) { return reject(err); })
                                                // console.log(data.name,"---", LAST_UPDATE_MANHWA_NAME)
                                            ];
                                        case 1:
                                            _b.sent();
                                            // console.log(data.name,"---", LAST_UPDATE_MANHWA_NAME)
                                            if (LAST_UPDATE_MANHWA !== null && data.Name === LAST_UPDATE_MANHWA.Name && data.Chapter == Number(LAST_UPDATE_MANHWA.Chapter)) {
                                                manhwa_not_updated = false;
                                                return [2 /*return*/, "break"];
                                            }
                                            return [4 /*yield*/, (0, DB_functions_1.manhwa_update)(data)];
                                        case 2:
                                            _b.sent();
                                            data.Genres = [];
                                            i += 1;
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            _a.label = 4;
                        case 4:
                            if (!(manhwas.length !== i && manhwa_not_updated)) return [3 /*break*/, 6];
                            return [5 /*yield**/, _loop_1()];
                        case 5:
                            state_1 = _a.sent();
                            if (state_1 === "break")
                                return [3 /*break*/, 6];
                            return [3 /*break*/, 4];
                        case 6:
                            i = 0;
                            page += 1;
                            return [3 /*break*/, 2];
                        case 7:
                            resolve(true);
                            return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports.toonily_update = toonily_update;
