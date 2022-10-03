import React from 'react'
import { useLayoutEffect } from 'react'
import { useState, useEffect, useRef } from 'react'
import { ManhwaT,GenreT } from '../../../../server/comics/Types'
import '../../styles/searchStyle.css'
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
        console.log('rerender serachbardropdown')
    })

    return (
        <div className="search-bar-dropdown">
            <input ref={reference} type="text" placeholder="Search " onChange={onInputChange} className="inputSearch"/>
            { isSearchFocused && reference.current.value !== "" ?
            <ul className="manhwa-search-group">
                {options.map((manhwa,index) => {
                    return (
                        <li key={index}>
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
        <div>
            <SearchBarDropdown options={manhwaData} onInputChange={onInputChange} reference={searchRef}/>
        </div>
    )
}