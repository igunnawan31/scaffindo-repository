"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NavbarComponentsHome = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md py-3 rounded-md mx-auto max-w-11/12 flex justify-between items-center mt-5 px-4 lg:px-8">
        <div className="flex items-center">
            <Link href="/" className="flex items-center">
                <Image
                    src="/assets/icons/sucoffindo.png"
                    alt="Sucoffindo Logo"
                    width={40}
                    height={40}
                    className="cursor-pointer"
                />
                <div className="text-blue-900 font-semibold font-sans mx-3">
                    Sucofindo
                </div>
            </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="relative group">
                <span className="text-blue-900 text-sm font-semibold capitalize">
                    Home
                </span>
                <div className="absolute left-0 w-0 h-[2px] bg-blue-900 transition-all duration-300 ease-in-out group-hover:w-full"></div>
            </Link>

            <Link href="/about" className="relative group">
                <span className="text-blue-900 text-sm font-semibold capitalize">
                    About
                </span>
                <div className="absolute left-0 w-0 h-[2px] bg-blue-900 transition-all duration-300 ease-in-out group-hover:w-full"></div>
            </Link>

            <Link href="/scan-product" className="relative group">
                <span className="text-blue-900 text-sm font-semibold capitalize">
                    Scan Product
                </span>
                <div className="absolute left-0 w-0 h-[2px] bg-blue-900 transition-all duration-300 ease-in-out group-hover:w-full"></div>
            </Link>

            <Link
                href="/sign-in"
                className="px-4 py-2 rounded-full bg-blue-900 text-white border-2 border-white 
                hover:bg-white hover:border-blue-900 hover:text-blue-900    
                text-sm font-semibold  transition"
            >
                Sign in as Business
            </Link>
      </div>

        <div className="md:hidden flex items-center">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none"
            >
                {isOpen ? (
                    <Image
                        src="/assets/icons/close-blue.svg"
                        alt="Close Menu"
                        width={28}
                        height={28}
                    />
                ) : (
                    <Image
                        src="/assets/icons/hamburger-blue.svg"
                        alt="Open Menu"
                        width={28}
                        height={28}
                    />
                )}
            </button>
        </div>

        {isOpen && (
            <div className="absolute top-20 right-4 bg-white shadow-lg rounded-lg p-4 flex flex-col space-y-4 w-48 md:hidden">
                <Link
                    href="/"
                    className="text-blue-900 text-sm font-semibold capitalize hover:underline"
                    onClick={() => setIsOpen(false)}
                >
                    Home
                </Link>
                <Link
                    href="/about"
                    className="text-blue-900 text-sm font-semibold capitalize hover:underline"
                    onClick={() => setIsOpen(false)}
                >
                    About
                </Link>
                <Link
                    href="/scan-product"
                    className="text-blue-900 text-sm font-semibold capitalize hover:underline"
                    onClick={() => setIsOpen(false)}
                >
                    Scan Product
                </Link>
                <Link
                    href="/sign-in"
                    className="px-4 py-2 rounded-full bg-blue-900 text-white border-2 border-white 
                    hover:bg-white hover:border-blue-900 hover:text-blue-900    
                    text-sm font-semibold  transition text-center"
                    onClick={() => setIsOpen(false)}
                >
                    Sign in as Business
                </Link>
            </div>
        )}
    </nav>
  );
};

export default NavbarComponentsHome;
