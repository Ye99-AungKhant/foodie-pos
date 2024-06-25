import { useAppSelector } from "@/store/hooks";
import { ThemeProvider, createTheme } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ThemeProviderWrapper({ children }: Props) {
  const { theme: appTheme } = useAppSelector((state) => state.app);
  const getDesignTokens = () => {
    if (appTheme === "light") {
      return {
        palette: {
          primary: {
            main: "#4C4C6D",
          },
          secondary: {
            main: "#FFE194",
          },
          info: {
            main: "#E8F6EF",
          },
          success: {
            main: "#1B9C85",
            dark: "",
          },
        },
      };
    }
    return {
      palette: {
        primary: {
          main: "#1d3557",
        },
        secondary: {
          main: "#a8dadc",
        },
        info: {
          main: "#f1faee",
        },
        success: {
          main: "#e63946",
        },
      },
    };
  };

  const theme = createTheme(getDesignTokens());
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
