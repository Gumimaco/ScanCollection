import React from 'react'
import { ManhwaT } from '../../../../server/comics/Types'

interface SearchResultProps {
    data: ManhwaT
}

export const SearchResult: React.FC<SearchResultProps> = ({data}) => {
    const {Name,Image,Chapter,Source} = data
    return (
        <div className="search-manhwa-component" id={Name} style={{'borderBottom':'1px solid gray','maxWidth':'inherit','backgroundColor':'black'}}>
            <div style={{'display':'flex','maxWidth':'inherit','width':'100%','boxSizing':'border-box'}}>
            <img src={Image} height="100px" referrerPolicy="no-referrer"></img>
            <div>
                <div>{Name}</div>
                <div>Chapter {Chapter}</div>
                <div>Source {Source}</div>
                <div>{}</div>
            </div>
            </div>
        </div>
    )
}