import { createTheme, Theme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface TypeBackground {
    highContrast: string;
    border: string;
  }
  interface PaletteOptions {
    colors?: {
      transparent?: string;
      linearGradient?: string;
      boxShadow?: string;
    };
  }
}

// Create a theme instance.
const theme: Theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    text: {
      primary: "#e3e3e3",
    },
    background: {
      default: "#1b2631",
      paper: "#193264",
      highContrast: "#99CCFF",
      border: "#616161",
    },

    colors: {
      transparent: "#00000000",
      linearGradient: "linear-gradient(to right, #99CCFF, #003366)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
    },
  },
});

export default theme;
