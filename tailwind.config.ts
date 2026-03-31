import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // --- Premium Design System ---
        "bg-main": "#0B0F1A",
        "bg-secondary": "#121826",
        "surface": "#1A2235",
        "surface-light": "#252E44",
        
        "brand": {
          primary: "#6C5CE7",
          secondary: "#00D1FF",
          accent: "#A29BFE",
        },
        
        "text": {
          primary: "#E6E9F0",
          secondary: "#A0A8C0",
          muted: "#6B7280",
        },
        
        "status": {
          success: "#00E676",
          warning: "#FFB020",
          error: "#FF4D6D",
        },
        
        "border-subtle": "#2A344A",
        
        // --- Mapping for Backward Compatibility (Optional but safer) ---
        "primary": "#6C5CE7",
        "secondary": "#00D1FF",
        "background": "#0B0F1A",
        "on-background": "#E6E9F0",
        "on-surface": "#E6E9F0",
        "outline-variant": "#2A344A",
        "surface-container-high": "#1A2235",
        "surface-container-highest": "#252E44",
        "surface-container-low": "#121826",
        "surface-container-lowest": "#0B0F1A",
      },
      borderRadius: {
        "xl": "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        "premium": "0 4px 20px rgba(0,0,0,0.25)",
        "glow-primary": "0 0 12px rgba(108,92,231,0.4)",
        "glow-secondary": "0 0 12px rgba(0,209,255,0.4)",
      },
      fontFamily: {
        headline: ["var(--font-headline)", "Inter", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        label: ["var(--font-body)", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #6C5CE7, #00D1FF)",
        "surface-gradient": "linear-gradient(180deg, rgba(26,34,53,1) 0%, rgba(18,24,38,1) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
