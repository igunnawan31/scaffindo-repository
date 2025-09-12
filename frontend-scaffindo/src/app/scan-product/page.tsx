"use client"

import React, { useEffect, useState } from 'react'
import Header from './scanproductcomponents/Header'
import NavbarComponentsHome from '../components/NavbarComponentsHome'
import ScanProductModal from './scanproductcomponents/ScanProductModal'
import Webcam from "react-webcam";

export default function ScanProduct() {
    return (
        <>
            <NavbarComponentsHome />
            <section
                id="ScanProduct"
                className="relative pt-32 bg-cover bg-center"
            >
                <div className="relative z-10 h-full px-4 lg:px-8">
                    <div className="container mx-auto max-w-11/12">
                        <Header />
                        <ScanProductModal />
                    </div>
                </div>
            </section>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0D47A1" fillOpacity="1" d="M0,256L48,224C96,192,192,128,288,128C384,128,480,192,576,202.7C672,213,768,171,864,128C960,85,1056,43,1152,58.7C1248,75,1344,149,1392,186.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
            <section
                id="InformationProduct"
                className="relative bg-cover bg-center"
            >
                <div className="relative z-10 h-full px-4 lg:px-8">
                    <div className="container mx-auto max-w-11/12">
                        
                    </div>
                </div>
            </section>
        </>
    )
}