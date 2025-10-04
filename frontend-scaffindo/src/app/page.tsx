"use client";

import Image from "next/image";
import NavbarComponentsHome from "./components/NavbarComponentsHome";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <NavbarComponentsHome />
      <section
        id="Home"
        className="relative min-h-screen pb-16 md:pb-24 pt-28 md:pt-36 bg-cover bg-center"
      >
        <Image
          src="/assets/images/sucofindo-2.png"
          alt="Sucoffindo Background"
          fill
          priority
          className="object-cover object-center z-5"
        />

        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-transparent z-5 opacity-60"></div>

        <div className="relative z-10 flex items-center justify-center h-full py-20 md:py-[10rem] px-4 lg:px-8">
          <div className="container mx-auto max-w-11/12">
            <div className="flex items-center justify-center mb-8 md:mb-10">
              <div className="w-full flex items-center justify-center">
                <div className="text-center">
                  <h1 className="mb-4 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold animate-fadeInUp text-white">
                    ChainTrack
                  </h1>
                  <div className="mb-4 w-3/4 md:w-1/2 bg-white h-1 rounded-full mx-auto"></div>
                  <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-center animate-fadeInUp delay-150 text-white px-4">
                    Solusi end-to-end untuk tracking produk makanan dari farm hingga consumer menggunakan teknologi blockchain. Memastikan transparency, accountability, dan rapid recall untuk food safety crisis.
                  </h2>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <Link
                href="/scan-product"
                className="group px-5 py-3 bg-blue-900 border-2 border-blue-900 text-white 
                  hover:bg-white hover:border-blue-900 hover:text-blue-900
                  rounded-lg font-semibold flex items-center"
              >
                Scan your Product
                <Image
                  src="/assets/icons/qrcode.svg"
                  width={20}
                  height={20}
                  alt="Qr Code"
                  className="ml-3 block group-hover:hidden"
                />
                <Image
                  src="/assets/icons/qrcode-blue.svg"
                  width={20}
                  height={20}
                  alt="Qr Code Blue"
                  className="ml-3 hidden group-hover:block"
                />
              </Link>
              <Link 
                href="/about"
                className="group px-5 py-3 bg-white border-2 border-white text-blue-900 
                  hover:bg-blue-900 hover:border-white hover:text-white
                  rounded-lg font-semibold flex items-center"
              >
                Know More About Us
                <Image
                  src="/assets/icons/info-blue.svg"
                  width={20}
                  height={20}
                  alt="Info Blue"
                  className="ml-3 block group-hover:hidden"
                />
                <Image
                  src="/assets/icons/info-white.svg"
                  width={20}
                  height={20}
                  alt="Info White"
                  className="ml-3 hidden group-hover:block"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
