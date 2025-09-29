"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cookie } from "next/font/google";
import { Montserrat } from "next/font/google";
import Image from "next/image";

const cookie = Cookie({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd + Shift + E (Mac)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        router.push("/edit");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center h-[70vh] w-full px-4 my-auto">
      <Image
        src="/chaitunes_bubbles.png"
        alt="ChaiTunes Bubbles"
        width={600}
        height={600}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}