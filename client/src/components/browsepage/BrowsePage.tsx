import React,{useState,useContext,useEffect} from 'react'
import { useLayoutEffect } from 'react';
import { Routes,Route,useNavigate,useSearchParams } from 'react-router-dom'
import { DBContext } from '../../App';
import './browseStyle.css'
import { GenreComponent } from './GenreComponent';
import { SortComponent } from './SortComponent';
import { SourceComponent } from './SourceComponent';
import { StatusComponent } from './StatusComponent';
const axios = require('axios')

const sort_list: string[] = [
    "A-Z","Z-A","Latest","Oldest","Rating"
]
const source_list: string[] = [
    'Asurascans','Toonily','Flamescans'
]
const status_list: string[] = [
    'Coming Soon','Ongoing','OnGoing','Completed','Hiatus','Mass Released'
]
// SORT BY A-Z,Z-A,Latest,Oldest,Rating
// FILTER GENRES
// FILTER SOURCE
// FILTER STATUS

interface BrowsePageProps {

}

export const BrowsePage: React.FC<BrowsePageProps> = ({}) => {
    const [searchParams] = useSearchParams({});
    const [genre_list, setgenre_list] = useState<Set<string>>(new Set())
    const [prevOptionOpened,setprevOptionOpened] = useState<DOMTokenList>(null)
    const DB = useContext(DBContext)
    const navigate = useNavigate()
    const [params,setparams] = useState<{Page: number,Sort: string,Genre: string[],Source: string,Status: string}>({ Page: 1,Sort: '',Genre: [],Source: '',Status: ''})
    
    useLayoutEffect(() => {
        for(let entry of searchParams.entries()) {
            if ((entry[0]) === 'Genre') {
                if (params.Genre.indexOf(entry[1]) === -1) {
                    params.Genre.push(entry[1])
                }
            } else {
                params[entry[0]] = entry[1]
            }
        }
    },[searchParams,DB])

    const goBack = () => {
        params.Page -= 1;
        createURLandJUMP()
    }
    const goForward = () => {
        params.Page += 1;
        createURLandJUMP()
    }
    const toggle_show_button = (name: string) => {
        let current = document.getElementsByClassName(`${name}-dropdown`)[0].classList;

        if (current === prevOptionOpened) {
            current.toggle('show')
            setprevOptionOpened(null)
        } else {
            if (prevOptionOpened !== null) {
                prevOptionOpened.toggle('show')
            } 
            current.toggle('show')
            setprevOptionOpened(current)
        }
    }

    useEffect(() => {
        if (typeof(DB) !== 'undefined' && genre_list.size === 0) {
            DB.genres.forEach(row => {genre_list.add(row.Genre)})
        }
        
    })
    const generate_query_URL = () => {
        let URL = "?"
        Object.keys(params).map(key => {
            if (key === "Genre") {
                params[key].forEach(genre => {
                    URL += `${key}=${genre}&`
                })
            } else {
                URL += `${key}=${params[key]}&`
            }
        })
        return URL
    }
    const createURLandJUMP = () => {
        const url = generate_query_URL()
        navigate(url)
    }

    const change_params = (mode: string, argument: React.MouseEvent<HTMLInputElement, MouseEvent>): void => {
        let button = argument.target as HTMLInputElement
        let prev = document.getElementById(params[mode]) as HTMLInputElement
        if (mode === "Genre") {
            if (button.checked) {
                if (params.Genre.indexOf(button.value) === -1) {
                    params.Genre.push(button.value)
                }
            } else {
                params.Genre = params.Genre.filter(genre => genre !== button.value)
            }
        } else {
            if (button.checked) {
                if (prev !== null) {
                    prev.checked = false;
                }
                params[mode] = button.value
            } else {
                params[mode] = ""
            }
        }
        console.log(params)
    }

    return (
        <div>
            WE HERE BIATCH
            <div style={{'display':'flex'}}>
                <GenreComponent genres={params.Genre} genre_list={genre_list} toggle_show_button={toggle_show_button} change_params={change_params}/>
                <SortComponent sort={params.Sort} sort_list={sort_list} toggle_show_button={toggle_show_button} change_params={change_params}/>
                <SourceComponent source={params.Source} source_list={source_list} toggle_show_button={toggle_show_button} change_params={change_params}/>
                <StatusComponent status={params.Status} status_list={status_list} toggle_show_button={toggle_show_button} change_params={change_params}/>
                <input type="submit" value="Search" onClick={createURLandJUMP}/>
            </div>
            {/* BASED ON AMOUNT OF LOADED MANHWAS WE CAN DETERINE IF WE NEED PREVIOUS/NEXT button */}
        </div>
    )
}