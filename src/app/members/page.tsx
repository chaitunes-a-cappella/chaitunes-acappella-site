import { Montserrat } from "next/font/google";
import { Cookie } from "next/font/google";

const montserrat600 = Montserrat({ subsets: ["latin"], weight: "600" });
const cookie = Cookie({ subsets: ["latin"], weight: "400" });

import Members from "./Members";

export const metadata = {
    title: "Members",
    icons: { icon: "/favicon.png" },
};

export default function MembersPage() {
    return <Members fontClass1={montserrat600.className} fontClass2={cookie.className} />;
}