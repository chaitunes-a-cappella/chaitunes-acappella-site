import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "chai-dark-blue": "#0343aa",
        "chai-light-blue": "#7dcaf4",
      },
    },
  },
  plugins: [],
};
export default config;
