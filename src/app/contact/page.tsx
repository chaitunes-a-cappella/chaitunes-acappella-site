"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import emailjs from "@emailjs/browser";

import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });

type FormData = {
    name: string;
    email: string;
    message: string;
};

export default function EmailForm() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState("");

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("Sending...");

        try {
            const result = await emailjs.send(
                "service_hoy0bhe",
                "template_jpsmaoc",
                formData,
                "IgtKKNh7L2VIjJlaW"
            );
            console.log(result.text);
            setStatus("Message sent successfully!");
            setFormData({ name: "", email: "", message: "" });
        } catch (error: any) {
            console.error(error.text || error);
            setStatus("Failed to send message. Please try again.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={
                montserrat.className +
                " bg-chai-dark-blue shadow-md rounded-lg p-6 max-w-3xl mx-auto flex flex-col gap-4 text-[#f0ede7] mt-[20%] sm:mt-20 w-3/4 md:w-full py-10"
            }
        >
            <h2 className="text-4xl font-semibold mb-4 text-center text-chai-light-blue">
                Contact Us
            </h2>
            <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-chai-dark-blue border border-chai-light-blue p-3 rounded focus:outline-none focus:ring-2 focus:ring-chai-light-blue placeholder:text-[#f0ede7]"
            />
            <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-chai-dark-blue border border-chai-light-blue p-3 rounded focus:outline-none focus:ring-2 focus:ring-chai-light-blue placeholder:text-[#f0ede7]"
            />
            <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="bg-chai-dark-blue border border-chai-light-blue p-3 rounded h-32 resize-none focus:outline-none focus:ring-2 focus:ring-chai-light-blue placeholder:text-[#f0ede7]"
            />
            <button
                type="submit"
                className="bg-chai-light-blue text-chai-dark-blue font-semibold py-3 rounded hover:bg-[#b1dff8] transition-colors"
            >
                Send
            </button>
            {status && <p className="text-center mt-2">{status}</p>}
        </form>
    );
}
