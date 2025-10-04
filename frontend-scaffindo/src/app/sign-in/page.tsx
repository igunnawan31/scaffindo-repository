import { Metadata } from "next";
import CardLogin from "./signincomponents/CardLogin";

export const metadata: Metadata = {
    title: "Sign-In | ChainTrack",
    description: "Becomes our Sucoffindo business partner",
    icons: {
        icon: "/icon.png" 
    },
    openGraph: {
        title: "Sign-In - ChainTrack",
        description: "Becomes our Sucoffindo business partner",
        url: "https://chaintrack.id/sign-in",
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


const SignInPage = () => {    
    return (
        <div className="relative z-10 flex items-center justify-center h-full py-[13rem] overflow-hidden">
            <CardLogin />
        </div>
    )
}

export default SignInPage;