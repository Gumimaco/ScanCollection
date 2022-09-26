import React,{useEffect,useState} from 'react'

interface StatusComponentProps {
    status: string,
    status_list: Array<string>,
    toggle_show_button: (name: string) => void,
    change_params: (mode: string, argument: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
}

export const StatusComponent: React.FC<StatusComponentProps> = ({status,status_list,toggle_show_button,change_params}) => {
    const [alreadySet, setalreadySet] = useState(false)
    console.log("STATUS:",status)
    useEffect(() => {
        let current = document.getElementById(status) as HTMLInputElement
        if (current !== null && !alreadySet) {
            current.checked = true   
            setalreadySet(true)
        }
    })
    
    return (
        <div className="Status">
            <input type="button" value="Status" onClick={() => toggle_show_button('status')}/>
            <div className="status-dropdown dropdown">
                {
                    status_list.map((value,index) => {
                        return (
                            <div key={'status'+index}>
                                <input type="checkbox" onClick={(button_id) => change_params("Status",button_id)} value={value} id={value}/>
                                <label htmlFor={value}>{value}</label>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}