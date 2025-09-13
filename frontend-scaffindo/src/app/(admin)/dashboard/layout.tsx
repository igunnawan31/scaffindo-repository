import Link from "next/link";
import Image from "next/image";
import Menu from "./admincomponents/Menu";
import Navbar from "./admincomponents/Navbar";

export default function AdminRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen flex font-sans">
            <div className="w-[15%] lg:w-[20%] bg-blue-900 h-screen flex flex-col">
                <div className="sticky top-0 bg-blue-900 z-10 p-4">
                    <Link href="/dashboard" className="flex items-center justify-center gap-2 xl:justify-start">
                        <div className="flex items-center gap-2 justify-start">
                            <div className="bg-white opacity-40 p-1 hidden lg:block">
                                <Image 
                                    src="/assets/icons/sucoffindo.png"
                                    width={40} 
                                    height={40} 
                                    alt="Logo Sucoffindo"
                                />
                            </div>
                            <div className="font-sans">
                                <span className="hidden xl:block text-sm text-white font-bold">
                                    username
                                </span>
                                <span className="hidden xl:block text-sm text-white">
                                    userEmail
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="w-11/12 bg-white h-1 rounded-full mx-auto hidden lg:block my-2"></div>
                <div className="flex-1 overflow-y-auto">
                    <Menu/>
                </div>
            </div>
            <div className="w-[85%] lg:w-[80%] bg-[#F7F8FA] h-screen overflow-y-auto">
                <Navbar />
                <div className="px-8 py-10 text-blue-900 w-full">
                    {children}
                </div>
            </div>
        </div>
    )
}