import React,{useLayoutEffect} from 'react'
import {Outlet} from 'react-router-dom'
import { useNavigate } from "react-router-dom";

export const NavbarDefault: React.FC = () => {
    const navigate = useNavigate()
    
    const change_to_browse = () => {
        navigate('/manhwa')
    }

    useLayoutEffect(() => {
        
    })
    return (
        <nav className="h-16 flex bg-pearl w-full items-center justify-between">
            <div className="flex items-center justify-center ml-2 h-12 md:ml-4">
                <img src={require("../../a.png")} className="h-12 w-12"></img>
                <div className="ml-2 text-dark-gray">Matus Scans</div>
            </div>
            <div className="flex mr-2 md:mr-4">
                <input className="py-2 px-4 rounded-md h-12 text-sans text-lg font-italic bg-dark-gray hover:bg-amber-500 hover:text-dark-gray ease-in-out duration-150" id="button-browse" type="button" value="BROWSE ALL" onClick={change_to_browse}></input>
            </div>
            
        </nav>
    );
}