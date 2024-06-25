import { useAppSelector } from "@/store/hooks";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";

export function TopBar() {
  const { data } = useSession();
  const { selectedLocation } = useAppSelector((state) => state.app);
  const { theme } = useAppSelector((state) => state.app);
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: theme === "light" ? "success.dark" : "primary.dark",
        height: "8%",
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Foodie POS
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {selectedLocation?.name}
        </Typography>
        {data && (
          <Button color="inherit" onClick={() => signOut()}>
            Sign out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
