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
                className="relative pb-24 pt-32 bg-cover bg-center"
            >
                <div className="relative z-10 h-full px-4 lg:px-8">
                    <div className="container mx-auto max-w-11/12">
                        <Header />
                        <ScanProductModal />
                    </div>
                </div>
            </section>
        </>
    )
}