import { useAppDispatch } from "@/store/hooks";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { createLocation } from "@/store/slices/locationSlice";
import { CreateLocationPayload } from "@/types/location";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newLocation: CreateLocationPayload;
  setNewLocation: Dispatch<SetStateAction<CreateLocationPayload>>;
}

export function NewLocationDialog({
  open,
  setOpen,
  newLocation,
  setNewLocation,
}: Props) {
  const dispatch = useAppDispatch();
  const handleCreateLocation = () => {
    const isValid =
      newLocation.name &&
      newLocation.street &&
      newLocation.township &&
      newLocation.city;
    if (!isValid) return alert("Missing required data");
    dispatch(
      createLocation({
        ...newLocation,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "Location created successfully",
            })
          );
          setOpen(false);
        },
        onError: () => {
          dispatch(
            showSnackbar({
              type: "error",
              message: "Error occurred when creating location",
            })
          );
        },
      })
    );
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>New Location</DialogTitle>
      <DialogContent sx={{ width: 300 }}>
        <Box>
          <TextField
            placeholder="name"
            sx={{ width: "100%", mb: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, name: evt.target.value })
            }
          />
          <TextField
            placeholder="street"
            sx={{ width: "100%", mb: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, street: evt.target.value })
            }
          />
          <TextField
            placeholder="township"
            sx={{ width: "100%", mb: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, township: evt.target.value })
            }
          />
          <TextField
            placeholder="city"
            sx={{ width: "100%", mb: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, city: evt.target.value })
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} sx={{ color: "#4C4C6D" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#4C4C6D",
            width: 100,
            height: 38,
            "&:hover": { bgcolor: "#66667c" },
          }}
          onClick={handleCreateLocation}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
