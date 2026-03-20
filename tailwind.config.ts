import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09090f",
        panel: "#11131b",
        accent: "#f65f8f",
        glow: "#6d6cff",
        muted: "#9ca3af",
        line: "rgba(255,255,255,0.08)"
      },
      boxShadow: {
        glow: "0 20px 80px rgba(109,108,255,0.25)"
      }
    }
  },
  plugins: []
};

export default config;
