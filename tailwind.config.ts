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
        neo: {
          yellow: "#FFE600",
          pink: "#FF2E93",
          purple: "#8A2BE2",
          cyan: "#00E5FF",
          green: "#00E676",
          orange: "#FF6D00",
          red: "#FF1744",
          bg: "#FAF8F5",
          card: "#FFFFFF",
          dark: "#0F172A",
          muted: "#64748B",
          border: "#000000",
        },
      },
      boxShadow: {
        "brutal-sm": "2px 2px 0px #000000",
        "brutal": "4px 4px 0px #000000",
        "brutal-lg": "6px 6px 0px #000000",
        "brutal-xl": "8px 8px 0px #000000",
        "brutal-yellow": "4px 4px 0px #FFE600",
        "brutal-pink": "4px 4px 0px #FF2E93",
        "brutal-cyan": "4px 4px 0px #00E5FF",
        "brutal-purple": "4px 4px 0px #8A2BE2",
        "brutal-inner": "inset 3px 3px 0px #000000",
      },
      borderWidth: {
        "3": "3px",
        "4": "4px",
        "5": "5px",
        "6": "6px",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      keyframes: {
        pulseSticker: {
          "0%, 100%": { transform: "scale(1) rotate(-2deg)" },
          "50%": { transform: "scale(1.05) rotate(2deg)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "sticker-pulse": "pulseSticker 3s infinite ease-in-out",
        "bounce-subtle": "bounceSubtle 2s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
