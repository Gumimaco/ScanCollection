import React,{useLayoutEffect} from 'react'
import {Outlet} from 'react-router-dom'
import '../../styles/navbarStyle.css'
export const Navbar: React.FC = () => {
    useLayoutEffect(() => {
        
    })
    return (
        <>
            <div className="Naviagtion-bar">
                
            </div>
            <Outlet/>
        </>
    );
}