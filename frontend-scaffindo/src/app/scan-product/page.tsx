"use client"

import React, { useEffect, useState } from 'react'
import Header from './scanproductcomponents/Header'
import NavbarComponentsHome from '../components/NavbarComponentsHome'
import ScanProductModal from './scanproductcomponents/ScanProductModal'
import Webcam from "react-webcam";
import JourneyProduct from './scanproductcomponents/JourneyProduct'

export default function ScanProduct() {
    const [labelId, setLabelId] = useState<string | null>(null);
    return (
        <>
            <NavbarComponentsHome />
            <section
                id="ScanProduct"
                className={`relative pt-32 ${labelId ? 'pb-0' : 'pb-80'} bg-cover bg-center bg-white max-h-full`}
            >
                <div className="relative z-10 h-full px-4 lg:px-8">
                    <div className="container mx-auto max-w-11/12">
                        <Header />
                        <ScanProductModal onLabelCode={setLabelId} />
                    </div>
                </div>
            </section>
            {labelId && (
                <section id="InformationProduct" className="relative bg-cover bg-center pt-12 bg-white">
                    <div className="relative z-10 h-full px-4 lg:px-8">
                        <div className="container mx-auto max-w-11/12">
                            <JourneyProduct labelId={labelId} />
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}