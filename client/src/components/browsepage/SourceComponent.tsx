import React,{useState,useEffect} from 'react'

interface SourceComponentProps {
    source: string,
    source_list: Array<string>,
    toggle_show_button: (name: string) => void,
    change_params: (mode: string, argument: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
}

export const SourceComponent: React.FC<SourceComponentProps> = ({source,source_list,toggle_show_button,change_params}) => {
    const [alreadySet, setalreadySet] = useState(false)
    console.log("SOURCE:",source)
    useEffect(() => {
        let current = document.getElementById(source) as HTMLInputElement
        if (current !== null && !alreadySet) {
            current.checked = true   
            setalreadySet(true)
        }
    })
    
    return (
        <div className="Source">
            <input type="button" value="Source" onClick={() => toggle_show_button('source')}/>
            <div className="source-dropdown dropdown">
                {
                    source_list.map((value,index) => {
                        return (
                            <div key={'source'+index}>
                                <input type="checkbox" onClick={(button_id) => change_params("Source",button_id)} value={value} id={value}/>
                                <label htmlFor={value}>{value}</label>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}