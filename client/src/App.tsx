import React, {useState,useLayoutEffect, FC} from 'react';
import Search from './components/search/Search';
import {ManhwaT} from '../../server/comics/Types'
const axios = require('axios')


const App: React.FC = () => {
    const [manhwaData, setManhwaData] = useState<ManhwaT[]>()

    useLayoutEffect(() => {
        axios.get(`http://localhost:5001/manhwa/`)
        .then(answer => setManhwaData(answer.data))
        .catch(error => console.log("ERROR",error))
    }, [])

  return (
    <div className="App">
      { manhwaData ? 
        //<Home_App/>
        <div>
            {manhwaData.slice(0,20).map(manhwa => {
              return (<li>
                <div>
                  <img src={manhwa.Image} height="180px" referrerPolicy="no-referrer"></img>
                </div>
              </li>)
            })}
        </div>
        : <div>LOADING DATA :)</div>
      }
    </div>
  );
}

export default App;
