import React,{useState,useContext,useEffect} from 'react'
import { useLayoutEffect } from 'react';
import { Routes,Route,useNavigate,useSearchParams } from 'react-router-dom'
import { DBContext } from '../../App';
import { ManhwaComponent } from '../defaultpage/ManhwaComponent';
import './browseStyle.css'
import { Filtercomponent } from './Filtercomponent';
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
    const [params,setparams] = useState<{Page: number,Sort: string,Genre: string[],Source: string,Status: string}>({ Page: 1,Sort: '',Genre: [],Source: '',Status: ''})
    const DB = useContext(DBContext)
    const [MANHWAS_TO_DISPLAY,setMANHWAS_TO_DISPLAY] = useState(null)
    const [toDisplayFilter,setToDisplayFilter] = useState<string>(null)
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
        let current = document.getElementsByClassName(`dropdown`)[0].classList;
        // nothing opened => open,set to current
        if (toDisplayFilter === null) {
            current.toggle('show')
            setToDisplayFilter(name)
        } else {
            if (toDisplayFilter === name) {
                current.toggle('show')
                setToDisplayFilter(null)
            } else {
                console.log("changing")
                setToDisplayFilter(name)
            }
        }
        // something opened => 1. IS IT THE CURRENT -> CLOSE, prev = none
        // 2. Different => change the render
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
            <div className="flex mt-4 relative gap-1">
                <input className="bg-pearl rounded px-1 text-black" type="button" value="Genres" onClick={() => toggle_show_button('genres')}/>
                <input className="bg-pearl rounded px-1 text-black" type="button" value="Sort By" onClick={() => toggle_show_button('sort')}/>
                <input className="bg-pearl rounded px-1 text-black" type="button" value="Source" onClick={() => toggle_show_button('source')}/>
                <input className="bg-pearl rounded px-1 text-black" type="button" value="Status" onClick={() => toggle_show_button('status')}/>
                <input className="bg-pearl rounded px-1 text-black" type="submit" value="Search" onClick={createURLandJUMP}/>
            </div>
            <Filtercomponent genres={params.Genre} genre_list={genre_list} sort={params.Sort} sort_list={sort_list}
            source={params.Source} source_list={source_list} status={params.Status} status_list={status_list} change_params={change_params} toDisplay={toDisplayFilter}/>
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
            <div className="navigation-buttons flex justify-center items-center mt-4">
                { MANHWAS_TO_DISPLAY ?
                    <div>
                    {   params.Page > 1 && MANHWAS_TO_DISPLAY.length > 0 ?
                            <input className="py-2 px-4 rounded-md h-12 text-sans text-lg font-italic bg-pearl text-dark-gray hover:bg-amber-500 ease-in-out duration-150" type="button" onClick={goBack} value="Previous Page"/>
                        : ""
                    }
                    { MANHWAS_TO_DISPLAY.length === 20 ?
                        <input className="py-2 px-4 ml-4 rounded-md h-12 text-sans text-lg font-italic bg-pearl text-dark-gray hover:bg-amber-500 ease-in-out duration-150" type="button" onClick={goForward} value="Next Page"/>
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