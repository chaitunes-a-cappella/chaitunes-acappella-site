import type { Metadata } from "next";
import AboutContent from "./About";

export const metadata: Metadata = {
    title: "About",
};

export default function AboutPage() {
    return <AboutContent />;
}
