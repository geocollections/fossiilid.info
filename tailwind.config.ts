import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default <Partial<Config>>{
  theme: {
    darkMode: "class",
    fontFamily: {
      serif: ["Merriweather", ...defaultTheme.fontFamily.serif],
    },
    container: {
      center: true,
    },
    extend: {
      colors: {
        tomato: {
          DEFAULT: "#f05f40",
          50: "#fef4f2",
          100: "#fee7e2",
          200: "#fed3ca",
          300: "#fdb4a4",
          400: "#f98870",
          500: "#f05f40",
          600: "#dd4525",
          700: "#ba371b",
          800: "#9a311a",
          900: "#802e1c",
          950: "#45140a",
        },
      },
    },
  },
};
