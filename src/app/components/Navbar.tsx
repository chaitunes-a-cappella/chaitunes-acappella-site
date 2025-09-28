"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Menu, X } from "lucide-react"; // hamburger & close icons

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <nav className="bg-chai-dark-blue shadow-md sticky top-0 z-50">
            <div className="flex justify-between items-center w-full mx-auto py-2 px-3 sm:px-5 lg:px-5">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                    <Image
                        src="/favicon.png"
                        alt="Logo"
                        width={80}
                        height={80}
                        className="w-20 sm:w-24 md:w-28 lg:w-28 xl:w-32 sm:-ml-1 md:-ml-2 lg:-ml-3 xl:-ml-0"
                    />
                </Link>

                {/* Hamburger button for md and smaller */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-chai-light-blue lg:hidden"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Nav links (hidden on small/medium, flex on large) */}
                <div
                    className={
                        montserrat.className +
                        " hidden lg:flex font-semibold text-chai-light-blue gap-5 sm:gap-6 md:gap-8 xl:gap-10 text-base md:text-lg xl:text-xl sm:mr-1 md:mr-2 lg:mr-3 xl:mr-5"
                    }
                >
                    <Link href="/" className="hover:text-[#b1dff8]">HOME</Link>
                    <Link href="/about" className="hover:text-[#b1dff8]">ABOUT</Link>
                    <Link href="/members" className="hover:text-[#b1dff8]">MEMBERS</Link>
                    <Link href="/contact" className="hover:text-[#b1dff8]">CONTACT</Link>
                </div>
            </div>

            {/* Dropdown menu for md and smaller */}
            <div
                className={
                    montserrat.className +
                    ` lg:hidden fixed inset-0 bg-chai-dark-blue/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center text-chai-light-blue font-semibold space-y-6 text-xl transform transition-transform duration-300 ${
                        isOpen ? "translate-x-0" : "translate-x-full"
                    }`
                }
            >
                {/* Exit button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-12 right-5 text-chai-light-blue hover:text-[#b1dff8] focus:outline-none"
                    aria-label="Close menu"
                >
                    <X size={30} />
                </button>

                <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-[#b1dff8]">HOME</Link>
                <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-[#b1dff8]">ABOUT</Link>
                <Link href="/members" onClick={() => setIsOpen(false)} className="hover:text-[#b1dff8]">MEMBERS</Link>
                <Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-[#b1dff8]">CONTACT</Link>
            </div>
        </nav>
    );
}


