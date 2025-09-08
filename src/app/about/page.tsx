import { Montserrat } from "next/font/google";

const montserrat500 = Montserrat({ subsets: ["latin"], weight: "500" });
const montserrat600 = Montserrat({ subsets: ["latin"], weight: "600" });

export default function About() {
    return (
        <div className="w-full h-full flex flex-col items-center text-center pb-10">
            <div
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/stars.jpg')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    width: "100%",
                    height: "200px",
                }}
                className="flex items-center justify-center text-white text-6xl"
            >
                <h1 className={montserrat600.className}>About</h1>
            </div>
            <div className={montserrat500.className + " mx-5 pt-5 text-xl text=[#444444]"}>
                <br />
                <br />
                <p>
                    ChaiTunes is Emory University’s only culturally Jewish a cappella
                    group, founded in 2009 by a group of talented students looking to
                    reestablish Emory’s previous culturally Jewish a cappella group, Kol
                    HaNesher (“Voice of the Eagle” in Hebrew). The group sings an
                    extensive repertoire of songs across all genres, including traditional
                    Jewish/Hebrew music, and secular works.
                </p>
                <br />
                <br />
                <p>
                    In 2018, ChaiTunes was chosen to <a href="https://www.youtube.com/watch?v=w_Uavn_LBDE" target="_blank" className="underline text-chai-dark-blue font-bold">compete</a> in and awarded at the
                    nation’s only Jewish a cappella competition, Kol HaOlam.
                </p>
                <br />
                <br />
                <p>
                    You can catch ChaiTunes performances at various events on Emory’s
                    campus including First Friday, Culture Shock, and their semiannual
                    concerts.
                </p>
                <br />
                <br />
                <p>
                    Follow us on social media to stay updated on upcoming performances, new music, and behind-the-scenes moments!
                </p>
            </div>
        </div>
    );
}
