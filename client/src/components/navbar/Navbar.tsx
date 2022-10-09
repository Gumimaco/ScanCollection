import React,{useLayoutEffect} from 'react'
import {Outlet} from 'react-router-dom'

export const Navbar: React.FC = () => {
    useLayoutEffect(() => {
        
    })
    return (
        <>
            <div className="Naviagtion-bar h-16 bg-pearl mb-6">
                
            </div>
            <div>
                AD
            </div>
            <Outlet/>
        </>
    );
}