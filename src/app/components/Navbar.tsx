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
            <div className="flex justify-between items-center w-full mx-auto py-3 px-4 sm:px-6 lg:px-6">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                    <Image
                        src="/favicon.png"
                        alt="Logo"
                        width={100}
                        height={100}
                        className="w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 sm:-ml-2 md:-ml-3 lg:-ml-4 xl:-ml-0"
                    />
                </Link>

                {/* Hamburger button for md and smaller */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-chai-light-blue lg:hidden"
                >
                    {isOpen ? <X size={30} /> : <Menu size={30} />}
                </button>

                {/* Nav links (hidden on small/medium, flex on large) */}
                <div
                    className={
                        montserrat.className +
                        " hidden lg:flex font-semibold text-chai-light-blue gap-6 sm:gap-8 md:gap-10 xl:gap-12 text-lg md:text-xl xl:text-2xl sm:mr-2 md:mr-3 lg:mr-4 xl:mr-7"
                    }
                >
                    <Link href="/" className="hover:text-[#b1dff8]">HOME</Link>
                    <Link href="/about" className="hover:text-[#b1dff8]">ABOUT</Link>
                    <Link href="/members" className="hover:text-[#b1dff8]">MEMBERS</Link>
                    <Link href="/repertoire" className="hover:text-[#b1dff8]">REPERTOIRE</Link>
                    <Link href="/contact" className="hover:text-[#b1dff8]">CONTACT</Link>
                </div>
            </div>

            {/* Dropdown menu for md and smaller */}
            <div
                className={
                    montserrat.className +
                    ` lg:hidden fixed inset-0 bg-chai-dark-blue/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center text-chai-light-blue font-semibold space-y-8 text-2xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`
                }
            >
                {/* Exit button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-14 right-6 text-chai-light-blue hover:text-[#b1dff8] focus:outline-none"
                    aria-label="Close menu"
                >
                    <X size={32} />
                </button>

                <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-[#b1dff8]">HOME</Link>
                <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-[#b1dff8]">ABOUT</Link>
                <Link href="/members" onClick={() => setIsOpen(false)} className="hover:text-[#b1dff8]">MEMBERS</Link>
                <Link href="/repertoire" onClick={() => setIsOpen(false)} className="hover:text-[#b1dff8]">REPERTOIRE</Link>
                <Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-[#b1dff8]">CONTACT</Link>
            </div>


        </nav>
    );
}

