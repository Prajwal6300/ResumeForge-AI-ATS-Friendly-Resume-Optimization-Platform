import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Consolas",
          "Menlo",
          "monospace",
        ],
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 2px)",
        "2xl": "calc(var(--radius) + 4px)",
        full: "9999px",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Keep brand for reference but use primary as main accent
        brand: {
          50: "#eff6ff",
          100: "#e8f0fe",
          200: "#c1d4f6",
          300: "#a5b7e7",
          400: "#809cdd",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
      },
      boxShadow: {
        subtle: "var(--shadow-subtle)",
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        input: "var(--shadow-input)",
        glow: "var(--shadow-glow)",
        focus: "var(--shadow-focus)",
        elev1: "var(--elev-1)",
        elev2: "var(--elev-2)",
        elev3: "var(--elev-3)",
        elev4: "var(--elev-4)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-slow": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-subtle": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out forwards",
        "fade-in-slow": "fade-in-slow 0.35s ease-out forwards",
        "fade-in-subtle": "fade-in-subtle 0.3s ease-out forwards",
        "slide-up": "slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-in": "slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "pulse-subtle": "pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "accordion-down": "accordion-down 0.2s ease-out forwards",
        "accordion-up": "accordion-up 0.2s ease-out forwards",
      },
    },
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};

export default config;