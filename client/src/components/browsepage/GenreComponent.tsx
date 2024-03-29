import React, { useEffect,useState } from 'react'

interface GenreComponentProps {
    genres: string[],
    genre_list: Set<string>,
    toggle_show_button: (name: string) => void,
    change_params: (mode: string, argument: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
}

export const GenreComponent: React.FC<GenreComponentProps> = ({genres,genre_list,toggle_show_button,change_params}) => {
    const [alreadySet, setalreadySet] = useState(false)
    
    useEffect(() => {
        let set = false
        genres.forEach(genre => {
            let current = document.getElementById(genre) as HTMLInputElement
            if (current !== null && !alreadySet) {
                current.checked = true
                set = true
            }
        })
        if (set)
            setalreadySet(true)
    })
    
    return (
        <div className="Genre px-3 rounded-md text-dark-gray mx-2 static">
            <input className="bg-pearl rounded px-1" type="button" value="Genres" onClick={() => toggle_show_button('genres')}/>
            
            <div className="genres-dropdown dropdown">
                <div className="bg-pearl dropdown flex w-5/6 flex-wrap my-2">
                { genre_list.size !== 0 ?
                    Array.from(genre_list).sort().map((genre,index) => { return (
                        <div key={'genre'+index} className="flex" >
                                <div className="mx-4 flex justify-center items-center">
                                    <input type="checkbox" onClick={event => change_params("Genre",event)} value={genre} id={genre}/>
                                    <label htmlFor={genre}>{genre}</label>
                                </div>
                            </div>
                        )
                    })
                    : ""
                }
                </div>
            </div>
        </div>
    )
}