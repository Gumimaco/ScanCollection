import React from 'react'
import { ManhwaT } from '../../../../server/comics/Types'
import moment from 'moment'
interface SearchResultProps {
    data: ManhwaT
}

export const SearchResult: React.FC<SearchResultProps> = ({data}) => {
    const {Name,Image,Chapter,Source,Modified,Link} = data
    return (
        <div className="search-manhwa-component" id={Name}>
            <a target="_self" href={Link} style={{'all':'unset'}}>
                <div style={{'display':'flex','maxWidth':'inherit','width':'100%','boxSizing':'border-box'}}>
                    <img src={Image} height="100px" referrerPolicy="no-referrer"></img>
                    <div>
                        <div>{Name}</div>
                        <div>Chapter {Chapter}</div>
                        <div>Source {Source}</div>
                        <div>Updated {moment(new Date(Modified)).fromNow()}</div>
                    </div>
                </div>
            </a>
        </div>
    )
}