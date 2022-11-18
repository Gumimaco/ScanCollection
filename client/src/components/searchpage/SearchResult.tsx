import React from 'react'
import { ManhwaT } from '../../../Types';
import moment from 'moment'
interface SearchResultProps {
    data: ManhwaT
}

export const SearchResult: React.FC<SearchResultProps> = ({data}) => {
    const {Name,Image,Chapter,Source,Modified,Link} = data
    return (
        <div className="search-manhwa-component w-62 md:w-94" id={Name}>
            <a target="_self" href={Link} style={{'all':'unset'}}>
                <div className="flex box-border">
                    <img src={Image} className="w-24" referrerPolicy="no-referrer"></img>
                    <div className="pl-1 pt-1 leading-5 font-sans">
                        <div className="font-bold">{Name}</div>
                        <div>Chapter {Chapter}</div>
                        <div>Source {Source}</div>
                        <div>Updated {moment(new Date(Modified)).fromNow()}</div>
                    </div>
                </div>
            </a>
        </div>
    )
}