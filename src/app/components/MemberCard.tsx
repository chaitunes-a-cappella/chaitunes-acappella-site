"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useEffect, useState } from "react";

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
    const [blurDataUrl, setBlurDataUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!image) return;

        let cancelled = false;

        async function generatePreview() {
            try {
                const img = new window.Image();
                img.crossOrigin = "anonymous";
                img.src = image;

                await new Promise<void>((resolve, reject) => {
                    img.onload = () => resolve();
                    img.onerror = () => reject(new Error("Image load error for LQIP"));
                });

                if (cancelled) return;

                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                const targetWidth = 20; // very small for tiny payload
                const ratio = img.height / img.width;
                const targetHeight = Math.max(12, Math.round(targetWidth * ratio));

                canvas.width = targetWidth;
                canvas.height = targetHeight;
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                // A compact JPEG data URL is a good tradeoff for blurDataURL
                const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
                if (!cancelled) setBlurDataUrl(dataUrl);
            } catch {
                // If cross-origin or other errors occur, silently fail — image will load normally
                // Optionally we could set a solid color placeholder here.
                // console.warn("LQIP generation failed:", err);
            }
        }

        generatePreview();

        return () => {
            cancelled = true;
        };
    }, [image]);
    return (
        <div className="flex flex-col items-center bg-chai-light-blue p-16 rounded-t-full mb-8">
            <br />
            <br />
            <div className="relative w-[270px] h-[270px] sm:w-[230px] sm:h-[230px] md:w-60 md:h-60">
                    <Image
                        src={image}
                        alt={`${first_name} ${last_name}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 230px, 240px"
                        loading="lazy"
                        decoding="async"
                        placeholder={blurDataUrl ? "blur" : "empty"}
                        blurDataURL={blurDataUrl ?? undefined}
                />
            </div>
            <br />
            <h2 className={`${montserratBold.className} text-2xl mt-2`}>{first_name} {last_name}</h2>
            {position && <p className={`${montserrat.className} text-lg mt-2`}>{position}</p>}
            <p className={`${montserrat.className} text-lg mt-2 -pb-2`}>Class of {year}</p>
        </div>
    );
}