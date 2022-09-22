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
exports.get_all_manhwas = exports.last_manhwa_updated = exports.genre_insert = exports.manhwa_update = exports.find_match_on_Name_source = exports.update = exports.manhwa_insert = void 0;
var mySQL = require('../mysqlPool.js');
var manhwa_insert = function (data) {
    mySQL.query("INSERT IGNORE INTO manhwaDB VALUES (\"".concat(data.Name, "\",\"").concat(data.Link, "\",\"").concat(data.Image, "\",").concat(data.Rating, ",").concat(data.Chapter, ",\"").concat(data.Modified, "\",\"").concat(data.Status, "\",\"").concat(data.Source, "\");"), function (err, res) {
        if (err)
            console.log("error while inserting manhwa", data);
    });
    data.Genres.forEach(function (genre) {
        (0, exports.genre_insert)(data.Name, data.Source, genre);
    });
};
exports.manhwa_insert = manhwa_insert;
var update = function (data) {
    return new Promise(function (resolve, reject) {
        mySQL.query("UPDATE manhwaDB SET Modified = \"".concat(data.Modified, "\", Chapter = \"").concat(data.Chapter, "\", Rating = \"").concat(data.Rating, "\" WHERE Name=\"").concat(data.Name, "\" AND Source=\"").concat(data.source, "\";"), function (err, res) {
            if (err)
                console.log("error while updating", data);
            console.log("UPDATED");
        });
    });
};
exports.update = update;
var find_match_on_Name_source = function (Name, source) {
    return new Promise(function (resolve, reject) {
        mySQL.query("SELECT * FROM manhwaDB WHERE Name='".concat(Name, "' AND Source='").concat(source, "';"), function (err, res) {
            resolve((res.length === 0));
        });
    });
};
exports.find_match_on_Name_source = find_match_on_Name_source;
var manhwa_update = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var isZero;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                isZero = true;
                return [4 /*yield*/, (0, exports.find_match_on_Name_source)(data.Name, data.Source)
                        .then(function (zero) {
                        isZero = zero;
                    })];
            case 1:
                _a.sent();
                if (!isZero) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, exports.manhwa_insert)(data)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, exports.update)(data)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.manhwa_update = manhwa_update;
var genre_insert = function (Name, Source, genre) {
    mySQL.query("INSERT IGNORE INTO genresDB VALUES (\"".concat(Name, "\",\"").concat(Source, "\",\"").concat(genre, "\");"), function (err, res) {
        if (err)
            console.log("error while inserting genre", Name, Source, genre);
    });
};
exports.genre_insert = genre_insert;
var last_manhwa_updated = function (Source) { return __awaiter(void 0, void 0, void 0, function () {
    var Name, promise;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                Name = '';
                promise = new Promise(function (resolve, reject) {
                    mySQL.query("SELECT * FROM manhwaDB WHERE Source = '".concat(Source, "' ORDER BY Modified DESC;"), function (err, res) {
                        if (res.length !== 0) {
                            resolve(res[0].Name);
                        }
                        resolve("");
                    });
                });
                return [4 /*yield*/, promise
                        .then(function (data) { Name = data; })["catch"](function (err) { return console.log("SHIT IS EMPTY?"); })];
            case 1:
                _a.sent();
                return [2 /*return*/, new Promise(function (resolve, reject) { return resolve(Name); })];
        }
    });
}); };
exports.last_manhwa_updated = last_manhwa_updated;
var get_all_manhwas = function () {
    return new Promise(function (resolve, reject) {
        mySQL.query('SELECT * FROM manhwaDB', function (error, response) {
            if (error)
                reject(error);
            resolve(response);
        });
    });
};
exports.get_all_manhwas = get_all_manhwas;
