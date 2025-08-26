import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideInLeft: {
          from: { transform: "translateX(-100px)" },
          to: { transform: "translateX(0)" },
        },
        slideInBottom: {
          from: { transform: "translateY(-100px)" },
          to: { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
