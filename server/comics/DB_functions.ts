var mySQL = require('../mysqlPool.js');
import axios from "axios";
import { ManhwaT } from "./Types";

export const manhwa_insert = (data: ManhwaT) => {
    mySQL.query(`INSERT IGNORE INTO manhwaDB VALUES ("${data.Name}","${data.Link}","${data.Image}",${data.Rating},${data.Chapter},"${data.Modified}","${data.Status}","${data.Source}");`, (err,res) => {
        if (err)
            console.log("error while inserting manhwa", data)
    })
    data.Genres.forEach(genre => {
        genre_insert(data.Name,data.Source,genre)
    })

}
export const update = (data) => {
    return new Promise((resolve,reject) => {
        mySQL.query(`UPDATE manhwaDB SET Modified = "${data.Modified}", Chapter = "${data.Chapter}", Rating = "${data.Rating}" WHERE Name="${data.Name}" AND Source="${data.source}";`,(err,res) => {
            if (err)
                console.log("error while updating", data)
            console.log("UPDATED")
        })
    })
}
export const find_match_on_Name_source = (Name,source): Promise<boolean> => {
    return new Promise((resolve,reject) => {
        mySQL.query(`SELECT * FROM manhwaDB WHERE Name='${Name}' AND Source='${source}';`,(err,res) => {
            resolve((res.length === 0))
        })
    })

}

export const manhwa_update = async (data: ManhwaT) => {
    let isZero: boolean = true;
    await find_match_on_Name_source(data.Name,data.Source)
    .then(zero => {
        isZero = zero;
    })
    if (isZero) {
        await manhwa_insert(data)
    } else {
        await update(data)
    }
}
export const genre_insert = (Name: string,Source: string,genre: string) => {
    mySQL.query(`INSERT IGNORE INTO genresDB VALUES ("${Name}","${Source}","${genre}");`,(err,res) => {
        if (err)
            console.log("error while inserting genre", Name,Source,genre)
    })
}


export const last_manhwa_updated = async (Source: string): Promise<string> => {
    let Name: string = ''
    const promise: Promise<string> = new Promise((resolve,reject) => {
        mySQL.query(`SELECT * FROM manhwaDB WHERE Source = '${Source}' ORDER BY Modified DESC;`, (err,res) => {
            if (res.length !== 0) {
                resolve(res[0].Name)
            }
            resolve("")
        })
    })
    await promise
    .then(data => { Name = data })
    .catch(err => console.log("SHIT IS EMPTY?"))

    return new Promise ((resolve,reject) => resolve(Name))
}

export const get_page_sort_by_modified = (page: number) => {
    // page < 0 ? page = 0 : page
    return new Promise((resolve,reject) => {mySQL.query(`SELECT * FROM manhwaDB ORDER BY Modified DESC LIMIT ${(page-1)*20},20`,(error,response) => {
        if (error)
            reject(error)
        resolve(response)
    })})
}
export const get_all_manhwas = (): Promise<ManhwaT[]> => {
    return new Promise((resolve,reject) => {
        mySQL.query(`SELECT * FROM manhwaDB ORDER BY Modified DESC`,(error,response) => {
            if (error)
                reject(error)
            resolve(response)
        })
    })
}
export const get_all_genres = (): Promise<{Name: string,Source: string,Genre: string}[]> => {
    return new Promise((resolve,reject) => {
        mySQL.query(`SELECT * FROM genresDB`,(error,response) => {
            if (error)
                reject(error)
            resolve(response)
        })
    })
}