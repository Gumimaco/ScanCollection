import React,{useState,useContext,useEffect} from 'react'
import { useLayoutEffect } from 'react';
import { Routes,Route,useNavigate,useSearchParams, useLocation } from 'react-router-dom'
import { DBContext } from '../../App';
import { ManhwaComponent } from '../defaultpage/ManhwaComponent';
import './browseStyle.css'
import { Filtercomponent } from './Filtercomponent';

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
    const [prevButton,setPrevButton] = useState(null)
    const [MANHWAS_TO_DISPLAY,setMANHWAS_TO_DISPLAY] = useState(null)
    const [paramsOnLoad,setParamsOnLoad] = useState({});
    const [toDisplayFilter,setToDisplayFilter] = useState<string>(null)
    const navigate = useNavigate()
    const location = useLocation()
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
        setParamsOnLoad({...params})
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
    const toggle_show_button = (name: string, e) => {
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
        return URL;
    }
    const compare_objects = (obj1,obj2) => {
        let different = false;
        if (typeof(obj2) === 'undefined' || typeof(obj1) === 'undefined') {
            return false;
        }
        for (let genre in obj1.Genre) {
            if (!obj2.Genre.includes(genre)) {
                different = true
                break;
            }
        }
        for (let genre in obj2.Genre) {
            if (!obj1.Genre.includes(genre)) {
                different = true
                break;
            }
        }
        if (obj1.Page !== obj2.Page) {
            different = true
        }
        if (obj1.Sort !== obj2.Sort) {
            different = true
        }
        if (obj1.Source !== obj2.Source) {
            different = true
        }
        if (obj1.Status !== obj2.Status) {
            different = true
        }
        return different;
    }
    const createURLandJUMP = () => {
        const url = generate_query_URL();
        if (compare_objects(paramsOnLoad,params)) {
            setMANHWAS_TO_DISPLAY(null)
            navigate(url);
        }
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
            <div className="ADPlacement justify-center items-center flex mt-6">
                <div className="w-5/6 bg-amber-500 text-dark-gray h-24 md:h-32">THIS IS AD</div>
            </div>
            <div className="">
                <div className="flex justify-center items-center">
                    <div className="md:w-auto justify-center self-center">
                        <div className="flex mt-6 gap-1 justify-center items-center">
                            <input className={`${toDisplayFilter === 'genres' ? 'bg-amber-500' : 'bg-pearl'} text-xl rounded px-1 text-black hover:bg-amber-500 ease-in-out duration-150 `} type="button" id="button-genres" value="Genres" onClick={(e) => toggle_show_button('genres',e)}/>
                            <input className={`${toDisplayFilter === 'sort' ? 'bg-amber-500' : 'bg-pearl'}  text-xl rounded px-1 text-black hover:bg-amber-500 ease-in-out duration-150 `} type="button" id="button-sort" value="Sort By" onClick={(e) => toggle_show_button('sort',e)}/>
                            <input className={`${toDisplayFilter === 'source' ? 'bg-amber-500' : 'bg-pearl'} text-xl rounded px-1 text-black hover:bg-amber-500 ease-in-out duration-150`} type="button" id="button-source" value="Source" onClick={(e) => toggle_show_button('source',e)}/>
                            <input className={`${toDisplayFilter === 'status' ? 'bg-amber-500' : 'bg-pearl'} text-xl rounded px-1 text-black hover:bg-amber-500 ease-in-out duration-150`} type="button" id="button-status" value="Status" onClick={(e) => toggle_show_button('status',e)}/>
                        </div>
                        <div className="flex justify-center mt-2 ">
                            <input className="bg-pearl rounded px-1 text-black hover:bg-amber-500 text-xl ease-in-out duration-150 w-full" type="submit" id="button-search" value="Search" onClick={createURLandJUMP}/>
                        </div>
                    </div>
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
            </div>
            {/* BASED ON AMOUNT OF LOADED MANHWAS WE CAN DETERINE IF WE NEED PREVIOUS/NEXT button */}
        </div>
    )
}