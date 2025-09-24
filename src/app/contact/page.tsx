import type { Metadata } from "next";
import EmailForm from "./EmailForm";

import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Contact",
};

export default function Contact() {
    return <EmailForm fontClass={`${montserrat.className}`} />;
}