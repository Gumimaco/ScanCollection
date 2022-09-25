import React from 'react';
import { ManhwaT } from '../../server/comics/Types'
import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/navbar/Navbar';
import { DefaultPage } from './components/defaultpage/DefaultPage';
// import { SearchPage } from './components/searchpage/SearchPage';
import { ErrorPage } from './components/errorpage/ErrorPage';

const axios = require('axios')


const App: React.FC = () => {

    return (
        <div className="App">
            <Routes>
                <Route element={<Navbar/>}>
                    <Route path="/" element={<DefaultPage/>}/>
                    {/* <Route path="manhwa/" element={<SearchPage/>}/> */}
                    <Route path="*" element={<ErrorPage/>}/>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
