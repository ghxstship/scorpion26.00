import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Gym Performance Zones
        zone: {
          // Main Brand / Training Floor (Red)
          red: {
            primary: "#8B0000",
            accent: "#A01010",
            base: "#0D0D0D",
            secondary: "#2A2A2A",
            metallic: "#C0C0C0",
          },
          // Cardio/Core Zone (Yellow) - Basic Training
          yellow: {
            primary: "#8B7500",
            accent: "#9A7B4F",
            base: "#000000",
            secondary: "#5A5A5A",
            metallic: "#D4D4D4",
          },
          // Performance Brand / VIP (Orange)
          orange: {
            primary: "#A0522D",
            accent: "#B87333",
            base: "#0A0A0A",
            secondary: "#424242",
            metallic: "#BEBEBE",
          },
          // Nutrition Center (Green)
          green: {
            primary: "#2F4538",
            accent: "#1C3026",
            base: "#101010",
            secondary: "#4A5D4F",
            metallic: "#E8E8E8",
          },
          // Intelligence / Performance Lab (Blue)
          blue: {
            primary: "#1C2841",
            accent: "#4A5F7F",
            base: "#0C0C0C",
            secondary: "#3D3D3D",
            metallic: "#AFAFAF",
          },
          // Recovery Sanctuary (Purple)
          purple: {
            primary: "#3E2347",
            accent: "#5C3A5E",
            base: "#0F0F0F",
            secondary: "#333333",
            metallic: "#B76E79",
          },
          // Team Sports / Community (Pink)
          pink: {
            primary: "#8B2252",
            accent: "#6B2D42",
            base: "#0A0A0A",
            secondary: "#383838",
            metallic: "#B8B8B8",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
