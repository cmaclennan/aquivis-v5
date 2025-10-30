export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern SaaS Palette
        primary: "#007BFF",
        "primary-hover": "#0056B3",
        accent: "#6F42C1",
        success: "#28A745",
        warning: "#FFC107",
        danger: "#DC3545",
        background: "#F8F9FA",
        "neutral-dark": "#343A40",
        "neutral-light": "#FFFFFF",
        // Legacy support
        "background-light": "#F8F9FA",
        "card-light": "#FFFFFF",
        "text-light": "#343A40",
        "text-muted-light": "#6C757D",
        "border-light": "#E0E0E0",
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.04)",
        card: "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.08)",
        md: "0 4px 6px rgba(0,0,0,0.07), 0 8px 12px rgba(0,0,0,0.1)",
        lg: "0 8px 16px rgba(0,0,0,0.08), 0 16px 32px rgba(0,0,0,0.12)",
        popover: "0 12px 24px rgba(0,0,0,0.15)",
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
      },
      spacing: {
        '0.5': '0.125rem',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
        '24': '6rem',
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'h2': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '28px', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};
