"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });
const montserratBold = Montserrat({ subsets: ["latin"], weight: "700" });

interface MemberCardProps {
    key: number;
    first_name: string;
    last_name: string;
    image: string;
    position?: string;
    year: number;
}

export default function MemberCard({
    first_name,
    last_name,
    image,
    position="",
    year,
}: MemberCardProps) {
    return (
        <div className="flex flex-col items-center bg-chai-light-blue p-16 rounded-t-full mb-8">
            <br />
            <br />
            <div className="relative w-[270px] h-[270px] sm:w-[230px] sm:h-[230px] md:w-60 md:h-60">
                <img
                    src={image}
                    alt={`${first_name} ${last_name}`}
                    className="object-cover "
                />
            </div>
            <br />
            <h2 className={`${montserratBold.className} text-2xl mt-2`}>{first_name} {last_name}</h2>
            {position && <p className={`${montserrat.className} text-lg mt-2`}>{position}</p>}
            <p className={`${montserrat.className} text-lg mt-2 -pb-2`}>Class of {year}</p>
        </div>
    );
}