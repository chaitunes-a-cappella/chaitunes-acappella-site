import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "ChaiTunes A Cappella",
    template: "ChaiTunes A Cappella | %s",
  },
  description:
    "The official website for ChaiTunes A Cappella at Emory University",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div
          className="xl:min-h-[calc(100vh-145px)] 
            lg:min-h-[calc(100vh-120px)] 
            md:min-h-[calc(100vh-115px)] 
            min-h-[calc(100vh-100px)] 
            flex flex-col bg-no-repeat bg-cover bg-center text-gray-900 m-0 p-0 w-full"
          style={{
            backgroundImage: "url('/background.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}

