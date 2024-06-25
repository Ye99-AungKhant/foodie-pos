import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import AppSnackbar from "./AppSnackbar";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface Props {
  children?: ReactNode;
}

const BackofficeAppLayout = ({ children }: Props) => {
  const { init, theme } = useAppSelector((state) => state.app);
  const { data } = useSession();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!init) {
      dispatch(fetchAppData({}));
    }
  }, []);

  return (
    <Box sx={{ height: "100vh", bgcolor: "red" }}>
      <TopBar />
      <Box sx={{ display: "flex", height: "92%" }}>
        {data && <Sidebar />}
        <Box
          sx={{
            backgroundColor: theme === "light" ? "info.main" : "primary.light",
            p: 2,
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
      <AppSnackbar />
    </Box>
  );
};

export default BackofficeAppLayout;
