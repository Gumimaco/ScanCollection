import { pool as mySQL } from '../mysqlPool.js';
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
                reject(err)
            resolve('Successfull')
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


export const last_manhwa_updated = async (Source: string): Promise<ManhwaT | null> => {
    return new Promise((resolve,reject) => {
        mySQL.query(`SELECT * FROM manhwaDB WHERE Source = '${Source}' ORDER BY Modified DESC;`, (err,res) => {
            if (err)
                throw err;
            if (res.length !== 0) {
                resolve(res[0])
            }
            resolve(null)
        })
    })
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

const generate_query_for_genres = (Genres: Array<string> | undefined) => {
    if (typeof(Genres) === "string") {
        console.log("HERE")
        return `SELECT Name,Source FROM genresDB WHERE Genre IN ("${Genres}") GROUP BY Name,Source HAVING COUNT(Name) = 1`
    }
    Genres = Genres?.map(val => {return `"${val}"`})
    if (typeof(Genres) === 'undefined' || Genres.length === 0 || Genres[0] === "") {
        return `SELECT Name,Source FROM genresDB GROUP BY Name,Source`
    }
    return `SELECT Name,Source FROM genresDB WHERE Genre IN (${Genres.join(',')}) GROUP BY Name,Source HAVING COUNT(Name) = ${Genres.length}`
}
const generate_query_for_where = (queries) => {
    let params: string[] = []
    if (typeof(queries['Source']) !== 'undefined' && queries['Source'] !== "") {
        params.push(`a.Source = \"${queries['Source']}\"`);
    }
    if (typeof(queries['Status']) !== 'undefined' && queries['Status'] !== "") {
        params.push(`a.Status = \"${queries['Status']}\"`);
    }
    return params.length === 0 ? "" : `WHERE ${params.join(' AND ')}`
}

const generate_query_for_order = (order: String | undefined) => {

    if (typeof(order) === 'undefined' || order === 'Latest' || order === "") {
        return "ORDER BY a.Modified DESC"
    }
    switch (order) {
        case "A-Z":
            return "ORDER BY a.Name ASC"
        case "Z-A":
            return "ORDER BY a.Name DESC"
        case "Oldest":
            return "ORDER BY a.Modified ASC"
        case "Rating":
            return "ORDER BY a.Rating DESC"
        default:
            return ""
    }

}

const generate_query_for_limit = (page: string | undefined) => {
    if (typeof(page) === 'undefined' || Number(page) < 1 || page === "") {
        return "LIMIT 0,20"
    }
    return `LIMIT ${(Number(page)-1)*20},20`
}

export const THE_QUERY_RESOLVER = (QUERY_PARAMS: {Page?: string,Sort?: string,Genre?: Array<string>,Source?:string,Status?: string}): Promise<{}[]> => {

    return new Promise((resolve,reject) => {
        const genre_filter = generate_query_for_genres(QUERY_PARAMS['Genre']);
        const where_filter = generate_query_for_where(QUERY_PARAMS);
        const order_filter = generate_query_for_order(QUERY_PARAMS['Sort']);
        const limit_filter = generate_query_for_limit(QUERY_PARAMS['Page']);
        let final_query = `SELECT * FROM (SELECT m.Name,m.Link,m.Image,m.Rating,m.Chapter,m.Modified,m.Status,m.Source FROM manhwaDB m JOIN (${genre_filter}) g ON m.Name = g.Name AND m.Source = g.Source) a ${where_filter} ${order_filter} ${limit_filter}`;
        console.log(final_query)
        mySQL.query(final_query,(err,res) => {
            if (err)
                reject(err)
            resolve(res)
        })
    })

}