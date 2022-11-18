import React, { useState } from "react"
import { ManhwaT } from '../../Types';
const axios = require('axios')

export const useLastUpdate = (page: number, increment_load: () => void ) => {

    const [manhwaData, setmanhwaData] = useState<ManhwaT[]>()
    
    axios.get(`http://localhost:5001/manhwa/?page=${page}`)
    .then(response => {
        setmanhwaData(response.data);
        increment_load();
    })
    .catch(error => console.error(error))

    return [manhwaData,setmanhwaData];
}