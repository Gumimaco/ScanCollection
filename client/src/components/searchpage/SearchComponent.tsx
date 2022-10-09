import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { ManhwaT,GenreT } from '../../../../server/comics/Types'
import { SearchResult } from './SearchResult'

interface SearchComponentProps {
    manhwa_DB: {manhwas: ManhwaT[],genres: GenreT[]}
}
interface ISearchBarDropdown {
    options: ManhwaT[],
    onInputChange: (e) => void,
    reference: React.MutableRefObject<any>
}

const SearchBarDropdown: React.FC<ISearchBarDropdown> = ({options,onInputChange,reference}) => {
    const [isSearchFocused, setisSearchFocused] = useState(false)

    useEffect(() => {
        document.addEventListener('click',(e) => {
            if (document.activeElement === reference.current) {
                setisSearchFocused(true)
            } else {
                setisSearchFocused(false)
            }
        })
    })

    return (
        <div className="search-bar-dropdown mt-10 mb-10">
            <input ref={reference} style={{'caretColor':'transparent'}}type="text" placeholder="Search" onChange={onInputChange} className=" font-sans relative focus:placeholder-transparent inputSearch mb-0 text-4xl border-b-2 w-64 focus:border-amber-500 md:w-96 pointer-events-auto :placeholder-pearl bg-dark-gray text-center :placeholder:text-center border-pearl outline-none"/>
            { isSearchFocused && reference.current.value !== "" ?
            <ul className="manhwa-search-group absolute border-x border-b mt-0 border-pearl flex-column min-h-0 max-h-96 md:max-h-112 w-64 md:w-96 overflow-auto no-scrollbar">
                {options.map((manhwa,index) => {
                    return (
                        <li key={index} className="flex bg-dark-gray text-pearl border-b w-62 md:w-94 hover:text-amber-500 hover:bg-dark-dark-gray ease-in-out duration-150">
                            <SearchResult data={manhwa}/>
                        </li>
                    )
                })}
            </ul> : ""
            }
        </div>
    )
}


export const SearchComponent: React.FC<SearchComponentProps> = ({manhwa_DB}) => {
    const [manhwaData,setmanhwaData] = useState<ManhwaT[]>([])
    const searchRef = useRef(null);
    
    const onInputChange = (e) => {
        if (e.target.value === "") {
            setmanhwaData([])
        } else {
            setmanhwaData(manhwa_DB.manhwas.filter( (name) => name.Name.toLowerCase().includes(e.target.value.toLowerCase()) ));
        }
        console.log(manhwaData)
    }
    return (
        <SearchBarDropdown options={manhwaData} onInputChange={onInputChange} reference={searchRef}/>
    )
}