import React from 'react'
import NavbarComponentsHome from '../components/NavbarComponentsHome'
import CardProblems from './aboutcomponents/CardProblems'
import CardSolution from './aboutcomponents/CardSolution'
import dummyProblems from '../data/problemsData'
import ChainTrackWorks from './aboutcomponents/ChainTrackWorks'
import Platforms from './aboutcomponents/Platforms'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "About | ChainTrack",
    description: "Know directly about us",
    icons: {
        icon: "/icon.png" 
    },
    openGraph: {
        title: "About - ChainTrack",
        description: "Know directly about us",
        url: "https://chaintrack.id/about",
            images: [
            {
                url: "https://chaintrack.id/assets/icons/sucoffindo.png",
                width: 1200,
                height: 630,
                alt: "ChainTrack QR Scanner",
            },
        ],
    },
    robots: "index,follow",
};

const AboutUsPage = () => {
    return (
        <>
            <NavbarComponentsHome />
            <section
                id="InformationProduct"
                className="relative pt-32 pb-32 bg-cover bg-center bg-white"
                data-theme="light"
            >
                <div className="relative z-10 h-full px-4 lg:px-8">
                    <div className="container mx-auto max-w-11/12">
                        <CardProblems title='Food Safety Crisis' problems={dummyProblems}/>
                        <CardSolution title='Food Safety Crisis' problems={dummyProblems} />
                        <ChainTrackWorks />
                        <Platforms />
                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutUsPage