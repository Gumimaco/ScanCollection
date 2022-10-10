import React,{useLayoutEffect,useContext} from 'react'
import {Outlet} from 'react-router-dom'
import { SearchComponent } from '../searchpage/SearchComponent'
import { DBContext } from '../../App'

export const Navbar: React.FC = () => {
    const SearchData = useContext(DBContext)

    useLayoutEffect(() => {
        
    })
    return (
        <>
            <nav className="h-16 flex bg-pearl w-full items-center justify-between">
                <div className="flex items-center justify-center ml-2 h-12 md:ml-4">
                    <img src={require("../../a.png")} className="h-12 w-12"></img>
                    <div className="ml-2 text-dark-gray">Matus Scans</div>
                </div>
                <div className="flex justify-center mr-2 md:mr-4">
                    <SearchComponent manhwa_DB={SearchData}/>
                </div>
            </nav>
            <Outlet/>
        </>
    );
}