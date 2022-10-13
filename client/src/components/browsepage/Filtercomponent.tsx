import React from 'react'
import { useEffect } from 'react'

interface FiltercomponentProps {
    genres: string[],
    genre_list: Set<string>,
    sort: string,
    sort_list: Array<string>,
    source: string,
    source_list: Array<string>,
    status: string,
    status_list: Array<string>,
    change_params: (mode: string, argument: React.MouseEvent<HTMLInputElement, MouseEvent>) => void,
    toDisplay: string,
}

export const Filtercomponent: React.FC<FiltercomponentProps> = ({genre_list,genres,sort,sort_list,status,status_list,source,source_list,change_params,toDisplay}) => {
    
    const render_different_parts = () => {
        switch(toDisplay) {
            case null:
                return <div></div>
            case 'genres':
                return Array.from(genre_list).sort().map((genre,index) => { return (
                    <div key={'genre'+index} className="flex w-1/6" >
                            <div className="mx-4 flex justify-center items-center">
                                <input type="checkbox" onClick={event => change_params("Genre",event)} value={genre} id={genre}/>
                                <label htmlFor={genre}>{genre}</label>
                            </div>
                        </div>
                    )
                })
            case 'sort':
                return sort_list.map((value,index) => {
                    return (
                        <div key={'sort'+index} className="flex w-1/6">
                            <input type="checkbox" onClick={(button_id) => change_params("Sort",button_id)} value={value} id={value}/>
                            <label htmlFor={value}>{value}</label>
                        </div>
                    )
                })
            case 'source':
                return source_list.map((value,index) => {
                    return (
                        <div key={'source'+index} className="flex w-1/6">
                            <input type="checkbox" onClick={(button_id) => change_params("Source",button_id)} value={value} id={value}/>
                            <label htmlFor={value}>{value}</label>
                        </div>
                    )
                })
            case 'status':
                return status_list.map((value,index) => {
                    return (
                        <div key={'status'+index} className="flex w-1/6">
                            <input type="checkbox" onClick={(button_id) => change_params("Status",button_id)} value={value} id={value}/>
                            <label htmlFor={value}>{value}</label>
                        </div>
                    )
                })
        }
    }
    useEffect(() => {
        render_checks();
    }, [toDisplay])
    const render_checks = () => {
        switch(toDisplay) {
            case null: {
                break
            }
            case 'genres': {
                let set = false
                genres.forEach(genre => {
                    let current = document.getElementById(genre) as HTMLInputElement
                    if (current !== null) {
                        current.checked = true
                        set = true
                    }
                })
                break;
            }
            case 'sort': {
                let current = document.getElementById(sort) as HTMLInputElement
                if (current !== null) {
                    current.checked = true   
                }
                break;
            }
            case 'status': {
                let current = document.getElementById(status) as HTMLInputElement
                if (current !== null) {
                    current.checked = true   
                }
                break;
            }
            case 'source': {
                let current = document.getElementById(source) as HTMLInputElement
                if (current !== null) {
                    current.checked = true   
                }
            }
        }
    }
    return (
        <div className="flex justify-center items-center w-full">
            <div className="bg-pearl dropdown flex flex-wrap w-5/6 my-2 max-h-40 rounded overflow-auto text-black justify-between items-center">
                { render_different_parts() }
            </div>
        </div>
    )
}
