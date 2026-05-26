/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        authFadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        authOrbFloat: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(20px, -30px) scale(1.03)" },
          "50%": { transform: "translate(-15px, 15px) scale(0.97)" },
          "75%": { transform: "translate(10px, 20px) scale(1.01)" },
        },
        fieldSlideIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(-8px)",
            maxHeight: "0",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
            maxHeight: "100px",
          },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        authFadeIn: "authFadeIn 0.6s ease-out",
        authOrbFloat: "authOrbFloat 20s ease-in-out infinite",
        fieldSlideIn: "fieldSlideIn 0.3s ease-out",
        gradientShift: "gradientShift 4s ease infinite",
      },
    },
  },
  plugins: [],
};
