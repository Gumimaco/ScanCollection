import React, {useState,useLayoutEffect} from 'react'
import { SearchComponent } from '../searchpage/SearchComponent';
import { ManhwaT, GenreT } from '../../../Types';
import { Manhwashowcase } from './Manhwashowcase';

const axios = require('axios')

export const DefaultPage: React.FC = () => {
    const [Data,setData] = useState<ManhwaT[]>()
    const [SearchData,setSearchData] = useState<{manhwas:ManhwaT[],genres: GenreT[]}>()
    const [Merged_DB,setMergedDB] = useState<ManhwaT[]>()

    
    useLayoutEffect(() => {
        axios.get(`https://scancollection-production.up.railway.app/manhwa/?page=${1}`)
        .then(response => {
            setData(response.data);
            console.log(response.data)
            // setLoading(Loading+40);
        })
        .catch(error => console.error(error))

        axios.get('https://scancollection-production.up.railway.app/manhwa/all')
        .then(response => {
            setSearchData(response.data)
            // setLoading(Loading+60)
        })
        .catch(error => console.log(error))
        
    }, [])
    
    return (
        <div>
            { Data ? 
                <div className="w-100">

                    <div className="Search-Browse flex-col items-center w-auto">

                        <div className="flex justify-center">
                            <SearchComponent manhwa_DB={SearchData}/>
                        </div>

                        <div className="ADPlacement justify-center flex">
                            <div className="w-5/6 bg-amber-500 text-dark-gray h-24 md:h-32">THIS IS AD</div>
                        </div>

                        <div className="justify-center flex">
                            <div className="text-white text-3xl mt-6">LAST UPDATED</div>
                        </div>

                    </div>

                    <div className="main-content flex justify-center items-center">
                        <Manhwashowcase data={Data}/>
                    </div>

                </div>
                : ""
            }
        </div>
    )
}