import React,{useState,useContext,useEffect} from 'react'
import { useLayoutEffect } from 'react';
import { Routes,Route,useNavigate,useSearchParams } from 'react-router-dom'
import { DBContext } from '../../App';
import { ManhwaComponent } from '../defaultpage/ManhwaComponent';
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
    const [params,setparams] = useState<{Page: number,Sort: string,Genre: string[],Source: string,Status: string}>({ Page: 1,Sort: '',Genre: [],Source: '',Status: ''})
    const DB = useContext(DBContext)
    const [MANHWAS_TO_DISPLAY,setMANHWAS_TO_DISPLAY] = useState(null)
    const navigate = useNavigate()
    
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
        
        axios.get(`http://localhost:5001/manhwa/${generate_query_URL()}`)
        .then(manhwas => setMANHWAS_TO_DISPLAY(manhwas.data))
        .catch(error => console.error('got error while getting manhwas from query'))
        console.log("RERENDER")
    },[searchParams])

    const goBack = () => {
        params.Page = Number(params.Page) - 1;
        createURLandJUMP()
    }
    const goForward = () => {
        params.Page = Number(params.Page) + 1;
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
        setMANHWAS_TO_DISPLAY(null)
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
    }

    return (
        <div>
            <div className="flex">
                <GenreComponent genres={params.Genre} genre_list={genre_list} toggle_show_button={toggle_show_button} change_params={change_params}/>
                <SortComponent sort={params.Sort} sort_list={sort_list} toggle_show_button={toggle_show_button} change_params={change_params}/>
                <SourceComponent source={params.Source} source_list={source_list} toggle_show_button={toggle_show_button} change_params={change_params}/>
                <StatusComponent status={params.Status} status_list={status_list} toggle_show_button={toggle_show_button} change_params={change_params}/>
                <input type="submit" value="Search" onClick={createURLandJUMP}/>
            </div>
            <div className="Manhwa-listing list-none flex justify-around mt-6 flex-wrap gap-4 mx-6">
                {   MANHWAS_TO_DISPLAY ?
                    MANHWAS_TO_DISPLAY.map((manhwa,index) => {
                        return (
                            <div key={index}>
                                <ManhwaComponent manhwaProp={manhwa}/>
                            </div>
                        )
                    })
                    : ""
                }
            </div>
            <div className="navigation-buttons">
                { MANHWAS_TO_DISPLAY ?
                    <div>
                    {   params.Page > 1 && MANHWAS_TO_DISPLAY.length > 0 ?
                            <input type="button" onClick={goBack} value="Previous Page"/>
                        : ""
                    }
                    { MANHWAS_TO_DISPLAY.length === 20 ?
                        <input type="button" onClick={goForward} value="Next Page"/>
                        : ""
                    }
                    </div>
                    : ""
                }
            </div>
            {/* BASED ON AMOUNT OF LOADED MANHWAS WE CAN DETERINE IF WE NEED PREVIOUS/NEXT button */}
        </div>
    )
}