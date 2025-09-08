import { Cookie } from "next/font/google";
import { Montserrat } from "next/font/google";

const cookie = Cookie({ subsets: ["latin"], weight: "400" });

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="w-full h-[70vh] flex flex-col items-center justify-center overflow-hidden">
  {/* Background image */}
  <div
    className="absolute top-50% left-50% xl:mt-[4%] lg:mt-[6%] md:mt-[8%] sm:mt-[9%] mt-[10%] w-full h-[70vh] bg-center bg-no-repeat bg-contain"
    style={{ backgroundImage: "url('/homeImage.png')" }}
  />

  {/* Text content */}
  <div className=" relative w-[280px] sm:w-[285px] z-10 text-center py-12 xl:mt-[4%] lg:mt-[6%] md:mt-[8%] mt-[10%] ml-[5.5%] sm:ml-[5%] md:ml-[3%] lg:ml-[3%] xl:ml-[2.5%] 2xl:ml-[1%]">
    <h1 className={` ${cookie.className} text-chai-dark-blue text-4xl sm:text-5xl font-bold mb-4`}>ChaiTunes</h1>
    <h1 className={`${cookie.className} text-chai-dark-blue text-4xl sm:text-5xl font-bold mb-4`}>A Cappella</h1>
    <hr className="border-t-4 border-dotted border-black border-chai-dark-blue ml-[4%] sm:ml-[5%] md:ml-[3.5%] lg:ml-[3%] xl:ml-[2.5%] 2xl:ml-[1%]" />
    <br className=""></br>
    <p className={`${montserrat.className} text-chai-dark-blue text-lg -mt-1 flex w-[70%] mx-auto ml-[45px] sm:ml-auto sm:mx-auto`}>Emory University's only culturally Jewish a cappella group</p>
  </div>
</main>

  );
}

