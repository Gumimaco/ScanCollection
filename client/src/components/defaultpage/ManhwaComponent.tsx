import React from 'react'
import { ManhwaT } from '../../../Types';
import moment from 'moment'

interface IPropsManhwa {
    manhwaProp: ManhwaT

}

export const ManhwaComponent: React.FC<IPropsManhwa> = ({manhwaProp}) => {
    const {Name,Link,Image,Rating,Chapter,Modified,Status,Source,Genres} = manhwaProp

    return (
        <div className="manhwa-listing h-54 w-36 md:h-96 md:w-56 mb-4 text-white hover:text-amber-500 ease-in-out duration-150 hover:scale-105 rounded-xl">
            <div className="flex-col flex">
                    <a target="_self" className="hover:cursor-pointer" href={Link} style={{'all':'unset'}}>
                        <img src={Image} className="w-36 h-48 md:h-72 md:w-56 mb-2 rounded-t-md hover:opacity-60"  referrerPolicy="no-referrer"></img>
                        <div className="text-xs md:text-base font-bold ">{Name}</div>
                    </a>
                    <div className="text-xs md:text-base">Chapter {Chapter} </div>
                    <div className="text-xs md:text-base">{moment(new Date(Modified)).fromNow()}</div>
            </div>
        </div>
    );
}