import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000ff",
        // primary: "#008A5E", 008A5E
        secondary: "#EF4444",
        accent: "#FACC15",
        "background-light": "#F3F4F6",
        "background-dark": "#111827",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1F2937",
        "border-light": "#e5e7eb",
        "border-dark": "#374151",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        "float-slow": "float 4s ease-in-out infinite",
        "float-medium": "float 3s ease-in-out infinite 0.5s",
        "float-fast": "float 2.5s ease-in-out infinite 1s",
        "wiggle": "wiggle 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(5deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(-3deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
