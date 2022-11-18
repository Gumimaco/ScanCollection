import React from 'react'
import {ManhwaT} from '../../../Types';
import { ManhwaComponent } from './ManhwaComponent'

interface ManhwashowcaseProps {
    data: ManhwaT[]
}

export const Manhwashowcase: React.FC<ManhwashowcaseProps> = ({data}) => {
    return (
        <div className="last-update-manhwas list-none flex justify-around mt-6 flex-wrap gap-2 mx-6">
            {
                data.map((manhwa,index) => {
                    return (
                    <li key={index}>
                        <ManhwaComponent manhwaProp={manhwa}/>
                    </li>
                    )
                })
            }
            
        </div>
    )
}