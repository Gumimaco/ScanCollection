import React from 'react'
import {ManhwaT} from '../../../../server/comics/Types'
import { ManhwaComponent } from './ManhwaComponent'

interface ManhwashowcaseProps {
    data: ManhwaT[],
    inc_load: () => void,
}

export const Manhwashowcase: React.FC<ManhwashowcaseProps> = ({data,inc_load}) => {
    return (
        <div className="last-update-manhwas" style={{'display':'flex','flexDirection':'row','flexWrap':'wrap','maxWidth':'100%','justifyContent':'space-between'}}>
            {
                data.map((manhwa,index) => {
                    return (
                    <li key={index}>
                        <ManhwaComponent manhwaProp={manhwa} increment={inc_load}/>
                    </li>
                    )
                })
            }
            
        </div>
    )
}