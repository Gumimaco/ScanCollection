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
exports.reaper_update = void 0;
var DomParser = require('dom-parser');
var parser = new DomParser();
var Types_1 = require("../Types");
var DB_functions_1 = require("../DB_functions");
var limiter_1 = require("limiter");
var axios = require('axios');
var time_convert = function (time, constant) {
    var now = new Date();
    time = time.replace('Released', '');
    var number = /\d+/;
    var amount_of_time = Number(time.match(number)[0]);
    time.replace('\n', '');
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
var reaper_data_update = function (manhwa, c) { return __awaiter(void 0, void 0, void 0, function () {
    var data, release, find;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = Types_1.DefaultManhwa;
                data.Link = manhwa.getElementsByClassName('flex-shrink-0')[0].getElementsByTagName('a')[0].attributes[0].value;
                data.Name = manhwa.getElementsByClassName('flex-shrink-0')[0].getElementsByTagName('a')[0].getElementsByTagName('img')[0].attributes[2].value;
                data.Image = manhwa.getElementsByClassName('flex-shrink-0')[0].getElementsByTagName('a')[0].getElementsByTagName('img')[0].attributes[1].value;
                return [4 /*yield*/, axios.get(data.Link)
                        .then(function (res) { return release = parser.parseFromString(res.data); })["catch"](function (error) { return console.log("URL OF MANHWA FAILED TO FETCH REAPER SCANS"); })];
            case 1:
                _a.sent();
                find = /\d+/;
                data.Chapter = release.getElementsByTagName('ul')[0].getElementsByTagName('p')[0].textContent.split('Chapter')[1].match(find)[0];
                data.Status = release.getElementsByTagName('dl')[0].getElementsByTagName('div')[1].getElementsByTagName('dd')[0].textContent;
                data.Modified = time_convert(release.getElementsByTagName('ul')[0].getElementsByTagName('p')[1].textContent, c);
                return [2 /*return*/, new Promise(function (resolve, reject) { resolve(data); })];
        }
    });
}); };
var reaper_update = function () { return __awaiter(void 0, void 0, void 0, function () {
    var limiter, config, dom, manhwa, manhwas, i, page, manhwa_not_updated, LAST_UPDATE_MANHWA, time_constant, _loop_1, state_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                limiter = new limiter_1.RateLimiter({ tokensPerInterval: 1, interval: 1250 });
                config = { "headers": { "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", "accept-language": "en-GB,en-US;q=0.9,en;q=0.8", "cache-control": "max-age=0" } };
                Types_1.DefaultManhwa.Source = 'Reaperscans';
                i = 0;
                page = 1;
                manhwa_not_updated = true;
                LAST_UPDATE_MANHWA = null;
                time_constant = 15;
                return [4 /*yield*/, (0, DB_functions_1.last_manhwa_updated)(Types_1.DefaultManhwa.Source)
                        .then(function (data) {
                        if (data !== null) {
                            LAST_UPDATE_MANHWA = data;
                        }
                    })["catch"](function (err) { return console.log("LASTTTTT"); })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!manhwa_not_updated) return [3 /*break*/, 7];
                return [4 /*yield*/, axios.get("https://reaperscans.com/latest/comics?page=".concat(page), config)
                        .then(function (res) { dom = parser.parseFromString(res.data); })["catch"](function (error) { return console.log("weird error when getting page", error); })];
            case 3:
                _a.sent();
                manhwas = dom.getElementsByClassName('grid');
                manhwas = manhwas[0].getElementsByClassName('transition');
                if (manhwas.length === 0) {
                    manhwa_not_updated = false;
                    return [3 /*break*/, 7];
                }
                _loop_1 = function () {
                    var manhwaCalls, data;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, limiter.removeTokens(1)];
                            case 1:
                                manhwaCalls = _b.sent();
                                manhwa = manhwas[i];
                                data = Types_1.DefaultManhwa;
                                return [4 /*yield*/, reaper_data_update(manhwa, time_constant)
                                        .then(function (update_data) { return data = update_data; })["catch"](function (err) { return console.log("ERROR IN RETRIEVING DATA FROM FUNCTION REAPER_GET_DATA"); })];
                            case 2:
                                _b.sent();
                                time_constant += 10;
                                if (LAST_UPDATE_MANHWA !== null && data.Name === LAST_UPDATE_MANHWA.Name && data.Chapter == LAST_UPDATE_MANHWA.Chapter) {
                                    manhwa_not_updated = false;
                                    return [2 /*return*/, "break"];
                                }
                                console.log(data.Name);
                                return [4 /*yield*/, (0, DB_functions_1.manhwa_update)(data)];
                            case 3:
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
                console.log("REAPER", page, i);
                i = 0;
                page += 1;
                return [3 /*break*/, 2];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.reaper_update = reaper_update;
