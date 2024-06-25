import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appDataSelector, setTheme } from "@/store/slices/appSlice";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { updateCompany } from "@/store/slices/companySlice";
import { UpdateCompanyPayload } from "@/types/company";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";

const Settings = () => {
  const { company, app } = useAppSelector(appDataSelector, shallowEqual);
  const [updateData, setUpdateData] = useState<UpdateCompanyPayload>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company) {
      setUpdateData(company);
    }
  }, [company]);

  const handleUpdateCompany = () => {
    if (!updateData)
      return dispatch(
        showSnackbar({ type: "error", message: "Required missing fields" })
      );
    dispatch(
      updateCompany({
        ...updateData,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "Updated company successfully",
            })
          );
        },
      })
    );
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={app.theme === "dark"}
              onChange={(evt, value) => {
                const theme = value ? "dark" : "light";
                dispatch(setTheme(theme));
                localStorage.setItem("theme", theme);
              }}
            />
          }
          label="Use dark mode"
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 400 }}>
        <TextField
          placeholder="Name"
          value={updateData?.name}
          sx={{ mb: 2 }}
          onChange={(evt) =>
            updateData &&
            setUpdateData({ ...updateData, name: evt.target.value })
          }
        />
        <TextField
          placeholder="Street"
          value={updateData?.street}
          sx={{ mb: 2 }}
          onChange={(evt) =>
            updateData &&
            setUpdateData({ ...updateData, street: evt.target.value })
          }
        />
        <TextField
          placeholder="Township"
          value={updateData?.township}
          sx={{ mb: 2 }}
          onChange={(evt) =>
            updateData &&
            setUpdateData({ ...updateData, township: evt.target.value })
          }
        />
        <TextField
          placeholder="City"
          value={updateData?.city}
          sx={{ mb: 2 }}
          onChange={(evt) =>
            updateData &&
            setUpdateData({ ...updateData, city: evt.target.value })
          }
        />
        <Button
          variant="contained"
          sx={{ mt: 4, width: "fit-content" }}
          onClick={handleUpdateCompany}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
