"use client"

import React, { useEffect, useState } from 'react'
import Header from './Header'
import NavbarComponentsHome from '../../components/NavbarComponentsHome'
import ScanProductModal from './ScanProductModal'
import JourneyProduct from './JourneyProduct'

export default function ScanProductClient() {
    const [labelId, setLabelId] = useState<string | null>(null);
    return (
        <>
            <NavbarComponentsHome />
            <section
                id="ScanProduct"
                className={`relative pt-32 ${labelId ? 'pb-0' : 'h-screen pb-80'} bg-cover bg-center bg-white`}
            >
                <div className="relative z-10 h-full px-4 lg:px-8">
                    <div className="container mx-auto max-w-11/12">
                        <Header />
                        <ScanProductModal onLabelCode={setLabelId} />
                    </div>
                </div>
                {labelId && (
                    <section id="InformationProduct" className="relative bg-cover bg-center pt-12 bg-white h-screen">
                        <div className="relative z-10 h-full px-4 lg:px-8">
                            <div className="container mx-auto max-w-11/12">
                                <JourneyProduct labelId={labelId} />
                            </div>
                        </div>
                    </section>
                )}
            </section>
        </>
    )
}