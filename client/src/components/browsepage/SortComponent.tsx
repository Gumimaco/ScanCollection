import React,{useState,useEffect} from 'react'

interface SortComponentProps {
    sort: string,
    sort_list: Array<string>,
    toggle_show_button: (name: string) => void,
    change_params: (mode: string, argument: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
}

export const SortComponent: React.FC<SortComponentProps> = ({sort,sort_list,toggle_show_button,change_params}) => {
    const [alreadySet, setalreadySet] = useState(false)
    
    useEffect(() => {
        let current = document.getElementById(sort) as HTMLInputElement
        if (current !== null && !alreadySet) {
            current.checked = true   
            setalreadySet(true)
        }
    })
    
    return (
        <div className="Sort">
            <input type="button" value="Sort By" onClick={() => toggle_show_button('sort')}/>
            <div className="sort-dropdown dropdown">
                {
                    sort_list.map((value,index) => {
                        return (
                            <div key={'sort'+index}>
                                <input type="checkbox" onClick={(button_id) => change_params("Sort",button_id)} value={value} id={value}/>
                                <label htmlFor={value}>{value}</label>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}