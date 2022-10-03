import React from 'react'
import { ManhwaT } from '../../../../server/comics/Types';
import { useNavigate } from "react-router-dom";
import moment from 'moment'

interface IPropsManhwa {
    manhwaProp: ManhwaT
    increment?: () => void
}

export const ManhwaComponent: React.FC<IPropsManhwa> = ({manhwaProp,increment}) => {
    let navigate = useNavigate();
    const {Name,Link,Image,Rating,Chapter,Modified,Status,Source,Genres} = manhwaProp

    return (
        <div className="manhwa-listing" style={{'padding':'10px','width':'215px'}}>
            <a target="_self" href={Link} style={{'all':'unset'}}>
            <div style={{'display':'flex','flexDirection':'column'}}>
                <div>
                    <img src={Image} height="300px" width="215px" referrerPolicy="no-referrer"></img>
                    <div>{Name}</div>
                    <div>Chapter {Chapter}</div>
                    <div>Updated {moment(new Date(Modified)).fromNow()}</div>
                </div>
            </div>
            </a>
        </div>
    );
}