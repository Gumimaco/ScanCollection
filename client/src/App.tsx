import React,{createContext,useLayoutEffect,useState} from 'react';
import { ManhwaT,GenreT } from '../../server/comics/Types'
import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/navbar/Navbar';
import { DefaultPage } from './components/defaultpage/DefaultPage';
import { BrowsePage } from './components/browsepage/BrowsePage';
import { ErrorPage } from './components/errorpage/ErrorPage';

const axios = require('axios')

export const DBContext = createContext(null)

const App: React.FC = () => {
    const [manhwaDB, setmanhwaDB] = useState<{manhwas: ManhwaT[],genres: GenreT[] }>()

    useLayoutEffect(() => {
        axios.get('http://localhost:5001/manhwa/all')
        .then(response => {
            setmanhwaDB(response.data)
        })
        .catch(error => console.log(error))
    }, [])
    return (
        <div className="App">
            <DBContext.Provider value={manhwaDB}>
                <Routes>
                    <Route path="/" element={<DefaultPage/>}/>
                    <Route element={<Navbar/>}>
                        <Route path="manhwa/*" element={<BrowsePage/>}/>
                        <Route path="*" element={<ErrorPage/>}/>
                    </Route>
                </Routes>
            </DBContext.Provider>
        </div>
    );
}

export default App;
