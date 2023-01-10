import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1b2631", // header #1b2631 -> #222222
      paper: "#193264", // paper #193264 -> #303030
      // @ts-expect-error
      highContrast: "#99CCFF",
    },
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
  },
  colors: {
    transparent: "#00000000",
    linearGradient: "linear-gradient(to right, #99CCFF, #003366)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
  },
});

export default theme;
