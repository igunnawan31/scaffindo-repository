import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "./signincomponents/Footer";

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <section id="SignIn" className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0">
                <Image 
                    src="/assets/images/sucofindo-1.jpg" 
                    fill
                    priority
                    className="object-cover object-center"
                    alt="Background Image"
                />
            </div>

            <div className="absolute inset-0 bg-blue-900 to-transparent opacity-60 z-5"></div>

            {children}
            <div className="z-10">
                <Footer />
            </div>
        </section>
    );
}
