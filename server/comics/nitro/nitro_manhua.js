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
exports.nitro_manhua = void 0;
var puppeteer_1 = require("puppeteer");
var Types_1 = require("../Types");
var DB_functions_1 = require("../DB_functions");
var DomParser = require('dom-parser');
var parser = new DomParser();
var axios = require('axios');
var month_translate = {
    'January': '01',
    'February': '02',
    'March': '03',
    'April': '04',
    'May': '05',
    'June': '06',
    'July': '07',
    'August': '08',
    'September': '09',
    'October': '10',
    'November': '11',
    'December': '12'
};
var date_convert = function (upload_date, constant) {
    var day = upload_date.split(',')[0].split(' ')[1].replace(/\s/g, "");
    var month = month_translate[upload_date.split(',')[0].split(' ')[0].replace(/\s/g, "")];
    var year = upload_date.split(',')[1].replace(/\s/g, "");
    var date = new Date("".concat(year, "-").concat(month, "-").concat(day));
    date.setSeconds(date.getSeconds() - constant);
    return date.toISOString();
};
var time_convert = function (time, constant) {
    var now = new Date();
    var find = /\d+/;
    var amount_of_time = Number(time.match(find)[0]);
    var period = time.split(' ')[1];
    switch (period) {
        case 'second':
        case 'seconds':
            now.setSeconds(now.getSeconds() - amount_of_time);
            break;
        case 'minute':
        case 'minutes':
            now.setMinutes(now.getMinutes() - amount_of_time);
            now.setSeconds(now.getSeconds() - constant);
            break;
        case 'hour':
        case 'hours':
            now.setHours(now.getHours() - amount_of_time);
            now.setSeconds(now.getSeconds() - constant);
            break;
        case 'day':
        case 'days':
            now.setDate(now.getDate() - amount_of_time);
            now.setSeconds(now.getSeconds() - constant);
            break;
        case 'week':
        case 'weeks':
            now.setDate(now.getDate() - (amount_of_time * 7));
            now.setSeconds(now.getSeconds() - constant);
            break;
        case 'month':
        case 'months':
            now.setMonth(now.getMonth() - amount_of_time);
            now.setSeconds(now.getSeconds() - constant);
            break;
        case 'year':
        case 'years':
            now.setMonth(now.getMonth() - (amount_of_time * 12));
            now.setSeconds(now.getSeconds() - constant);
            break;
    }
    return now.toISOString();
};
var nitro_manhua_update = function (manhwa, seconds) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var data, last_chapter, find, release, genres;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = Types_1.DefaultManhwa;
                    if (manhwa.getElementsByClassName('img-responsive').length === 0) {
                        reject(false);
                        return [2 /*return*/];
                    }
                    data.Name = manhwa.getElementsByTagName('a')[0].attributes[1].value.replace(/&#8217;/g, "'");
                    data.Link = manhwa.getElementsByTagName('a')[0].attributes[0].value;
                    data.Image = manhwa.getElementsByTagName('img')[0].attributes[2].value;
                    last_chapter = manhwa.getElementsByClassName('chapter-item')[0];
                    find = /\d+/;
                    data.Chapter = Number(last_chapter.getElementsByTagName('a')[0].innerHTML.match(find)[0]);
                    if (last_chapter.getElementsByTagName('a').length === 2) {
                        data.Modified = time_convert(last_chapter.getElementsByTagName('a')[1].attributes[1].value, seconds);
                    }
                    else {
                        data.Modified = date_convert(last_chapter.getElementsByClassName('post-on')[0].innerHTML, seconds);
                    }
                    _a.label = 1;
                case 1:
                    if (!(release == undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, axios.get(data.Link)
                            .then(function (res) { return release = parser.parseFromString(res.data); })["catch"](function (error) { return console.log(data.Link, "error while going to the link"); })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3:
                    data.Status = release.getElementsByClassName('summary-content')[8].innerHTML;
                    genres = release.getElementsByClassName('post-content_item')[5];
                    if (genres.length !== 0) {
                        genres.getElementsByTagName('a').forEach(function (manhwa) {
                            data.Genres.push(manhwa.innerHTML);
                        });
                    }
                    data.Rating = release.getElementsByClassName('score')[0].innerHTML;
                    resolve(data);
                    return [2 /*return*/];
            }
        });
    }); });
};
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
var nitro_manhua = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var dom, manhwas, i, manhwa_not_updated, LAST_UPDATE_MANHWA, time_constant, browser, w_page, html, new_amount, _loop_1, state_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dom = null;
                            Types_1.DefaultManhwa.Source = 'Nitroscans';
                            manhwas = [];
                            i = 1;
                            manhwa_not_updated = true;
                            LAST_UPDATE_MANHWA = null;
                            time_constant = 15;
                            return [4 /*yield*/, (0, DB_functions_1.last_manhwa_updated)(Types_1.DefaultManhwa.Source)
                                    .then(function (data) {
                                    if (data !== null) {
                                        LAST_UPDATE_MANHWA = data;
                                    }
                                })["catch"](function (err) { return resolve(true); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, puppeteer_1["default"].launch({ args: ['--no-sandbox'] })];
                        case 2:
                            browser = _a.sent();
                            return [4 /*yield*/, browser.newPage()];
                        case 3:
                            w_page = _a.sent();
                            return [4 /*yield*/, w_page.goto('https://nitroscans.com/manga-genre/manhua/?m_orderby=latest')];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, w_page.waitForSelector('#navigation-ajax')];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6: return [4 /*yield*/, w_page.content()];
                        case 7:
                            html = _a.sent();
                            dom = parser.parseFromString(html);
                            new_amount = dom.getElementsByClassName('col-12');
                            if (manhwas.length === new_amount.length) {
                                manhwa_not_updated = false;
                                return [3 /*break*/, 15];
                            }
                            manhwas = new_amount;
                            _loop_1 = function () {
                                var data, should_skip;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            should_skip = false;
                                            return [4 /*yield*/, nitro_manhua_update(manhwas[i], time_constant)
                                                    .then(function (output_data) { return data = output_data; })["catch"](function (error) { return should_skip = true; })];
                                        case 1:
                                            _b.sent();
                                            time_constant += 10;
                                            if (should_skip) {
                                                console.log("SKIPPING", i);
                                                return [2 /*return*/, "continue"];
                                            }
                                            if (LAST_UPDATE_MANHWA !== null && data.Name === LAST_UPDATE_MANHWA.Name && data.Chapter === Number(LAST_UPDATE_MANHWA.Chapter)) {
                                                manhwa_not_updated = false;
                                                return [2 /*return*/, "break"];
                                            }
                                            return [4 /*yield*/, (0, DB_functions_1.manhwa_update)(data)];
                                        case 2:
                                            _b.sent();
                                            data.Genres = [];
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            _a.label = 8;
                        case 8:
                            if (!(i < manhwas.length)) return [3 /*break*/, 11];
                            return [5 /*yield**/, _loop_1()];
                        case 9:
                            state_1 = _a.sent();
                            if (state_1 === "break")
                                return [3 /*break*/, 11];
                            _a.label = 10;
                        case 10:
                            i++;
                            return [3 /*break*/, 8];
                        case 11: return [4 /*yield*/, w_page.evaluate(function () {
                                var button = document.querySelector('#navigation-ajax');
                                button === null || button === void 0 ? void 0 : button.click();
                            })];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, delay(7000)];
                        case 13:
                            _a.sent();
                            _a.label = 14;
                        case 14:
                            if (manhwa_not_updated) return [3 /*break*/, 6];
                            _a.label = 15;
                        case 15:
                            console.log("Nitro Manhua succesfull ending");
                            browser.close();
                            resolve(true);
                            return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports.nitro_manhua = nitro_manhua;
