"use client"

import Image from "next/image"
import { useState } from "react";
import Link from "next/link";

const CardForgotPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = () => {
        alert("Button Login clicked");
    }

    return (
        <div className="w-full mx-10 lg:w-1/4 md:w-1/2 bg-white shadow-lg p-6 border border-gray-200 rounded-lg">
            <div className="relative z-10">
                <Link
                    href='/sign-in' 
                    className="flex items-center text-sm sm:text-base z-10 mb-5 hover:opacity-50"
                >
                    <Image 
                        src={"/assets/icons/back.svg"} 
                        alt="Back" 
                        width={10} 
                        height={10} 
                    />
                    <span className="ml-2 text-blue-900 text-sm">Back To Sign In</span>
                </Link>
                <h1 className="text-4xl font-bold text-blue-900 text-center mb-2">Forgot Password</h1>
                <h2 className="text-center text-sm text-blue-900 mb-6">
                    Don't worry about losing your account
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block font-semibold text-blue-900 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            // value={formData.email}
                            // onChange={handleChange}
                            placeholder="Email"
                            className={`w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 `}
                            // ${errors.email ? 'focus:ring-red-400 border border-red-400' : 'focus:ring-red-400'} error
                        />
                        {/* {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>} */}
                    </div>

                    <div className="flex justify-center mt-5">
                        <button type="submit" className="p-3 rounded-full bg-blue-900 border-2 border-blue-900 text-white font-semibold hover:bg-white hover:text-blue-900 hover:border-blue-900 transition cursor-pointer">
                            Send OTP
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CardForgotPassword