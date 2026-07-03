import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#4168a3",
      dark: "#2d4f7c",
      light: "#e8f0fc",
    },
    secondary: {
      main: "#b85450",
    },
  },
  typography: {
    fontFamily: '"Jura", sans-serif',
  },
});
