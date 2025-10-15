import type { Metadata } from "next";
import AboutContent from "./About";

export const metadata: Metadata = {
    title: "About",
    icons: { icon: "/favicon.png" },
};

export default function AboutPage() {
    return <AboutContent />;
}
