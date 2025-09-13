"use client"

import Image from "next/image"
import { IoCaretDown } from "react-icons/io5"
import { useState } from "react";
import { useRef } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    return (
        <div className="bg-white shadow-sm fixed w-[90%] lg:w-[80%] z-50">
            <div className="flex justify-end items-center p-5 bg-white shadow-md">
                <div className="flex items-center gap-4 pr-2">
                    <div className="relative" ref={dropdownRef}>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}>
                            <div className="bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center">
                            </div>
                            <IoCaretDown className="text-blue-900" />
                        </div>
                        {isDropdownMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                                <ul className="py-2 text-sm text-black">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar