import React, {useState,useLayoutEffect} from 'react'
import { SearchComponent } from '../searchpage/SearchComponent';
import { LinearProgress, Input } from '@mui/material';
import { ManhwaT, GenreT } from '../../../../server/comics/Types';
import { Manhwashowcase } from './Manhwashowcase';
import { useNavigate } from "react-router-dom";

import '../../styles/hiddenStyle.css'
import '../../styles/defaultpageStyle.css'
const axios = require('axios')

export const DefaultPage: React.FC = () => {
    const [Loading, setLoading] = useState<number>(0)
    const [Data,setData] = useState<ManhwaT[]>()
    const [SearchData,setSearchData] = useState<{manhwas:ManhwaT[],genres: GenreT[]}>()
    const [Merged_DB,setMergedDB] = useState<ManhwaT[]>()
    const navigate = useNavigate()

    const change_to_browse = () => {
        navigate('/manhwa')
    }
    const loadIncrement = () => {
        setLoading((Loading) => Loading+4);
    }
    
    useLayoutEffect(() => {
        axios.get(`http://localhost:5001/manhwa/?page=${1}`)
        .then(response => {
            setData(response.data);
            // setLoading(Loading+40);
        })
        .catch(error => console.error(error))

        axios.get('http://localhost:5001/manhwa/all')
        .then(response => {
            setSearchData(response.data)
            // setLoading(Loading+60)
        })
        .catch(error => console.log(error))

        
    }, [])
    
    return (
        <div>
            {/* { Loading !== 100 ? <LinearProgress color="secondary" />: null } */}
            { Data ? 
                <div>
                    <div className="Search-Browse">
                        <SearchComponent manhwa_DB={SearchData}/>
                        <input id="button-browse" type="button" value="BROWSE ALL" onClick={change_to_browse}></input>
                    </div>
                    <Manhwashowcase data={Data} inc_load={loadIncrement}/>
                </div>
                : ""
            }
        </div>
    )
}