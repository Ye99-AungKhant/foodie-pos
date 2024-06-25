import { Alert, Snackbar } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { hideSnackbar } from "../store/slices/appSnackbarSlice";

const AppSnackbar = () => {
  const { type, open, message } = useAppSelector((state) => state.snackbar);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(hideSnackbar());
    }, 3000);
  }, [message]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      onClose={() => {}}
    >
      <Alert
        onClose={() => dispatch(hideSnackbar())}
        severity={type}
        variant="filled"
        sx={{
          width: "100%",
          bgcolor: type === "error" ? "#EE4266" : "#1B9C85",
          color: "#E8F6EF",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AppSnackbar;
