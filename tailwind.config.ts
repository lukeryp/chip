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
        green: {
          DEFAULT: "#00af51",
          dim: "#007a38",
          xdim: "#033a1c",
          bright: "#00cf61",
        },
        yellow: {
          DEFAULT: "#f4ee19",
          dim: "#c9c412",
        },
        black: "#0d0d0d",
        card: {
          DEFAULT: "#161616",
          2: "#1e1e1e",
          3: "#252525",
        },
        border: "#2a2a2a",
        text: {
          DEFAULT: "#f0f0f0",
          muted: "#777777",
          dim: "#aaaaaa",
        },
        power: "#ff6432",
        recovery: "#6699ff",
      },
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
        "work-sans": ["Work Sans", "sans-serif"],
      },
      animation: {
        "slide-up": "slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
        bounce: "bounce 0.6s infinite alternate",
        "confetti-fall": "confettiFall linear forwards",
      },
      keyframes: {
        slideUp: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        confettiFall: {
          "0%": { transform: "translateY(-10px) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translateY(110vh) rotate(720deg)",
            opacity: "0",
          },
        },
      },
      backdropBlur: {
        xs: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
