import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-blue": "#08296C",
        "brand-orange": "#F47820",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(to right, #08296C, #F47820)",
      },
    },
  },
  plugins: [],
};
export default config;
