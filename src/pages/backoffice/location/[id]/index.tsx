import DeleteDialog from "@/components/DeleteDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedLocation } from "@/store/slices/appSlice";
import { deleteLocation, updateLocation } from "@/store/slices/locationSlice";
import { UpdateLocationPayload } from "@/types/location";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LocationDetail = () => {
  const [open, setOpen] = useState(false);
  const [updateData, setUpdateData] = useState<UpdateLocationPayload>();
  const router = useRouter();
  const locationId = Number(router.query.id);
  const { selectedLocation } = useAppSelector((state) => state.app);
  const { locations } = useAppSelector((state) => state.location);
  const location = locations.find((item) => item.id === locationId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (location) {
      setUpdateData(location);
    }
  }, [location]);

  if (!updateData) {
    return (
      <Box>
        <Typography>Location not found</Typography>
      </Box>
    );
  }

  const handleUpdate = () => {
    dispatch(updateLocation(updateData));
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
          Delete
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 500 }}>
        <TextField
          sx={{ mb: 2 }}
          value={updateData.name}
          onChange={(evt) =>
            setUpdateData({ ...updateData, name: evt.target.value })
          }
        />
        <FormControlLabel
          control={
            <Switch
              sx={{ transform: "scale(1.5)" }}
              defaultChecked={selectedLocation?.id === locationId}
              onChange={() => {
                if (location) {
                  localStorage.setItem(
                    "selectedLocationId",
                    String(location.id)
                  );
                  dispatch(setSelectedLocation(location));
                }
              }}
            />
          }
          label="Current location"
        />
        <Button
          variant="contained"
          sx={{ mt: 4, width: "fit-content" }}
          onClick={handleUpdate}
        >
          Update
        </Button>
      </Box>
      <DeleteDialog
        open={open}
        setOpen={setOpen}
        title="Delete Location"
        content="Are you sure you want to delete this location?"
        handleDelete={() => {
          dispatch(deleteLocation({ id: locationId }));
          setOpen(false);
          router.push("/backoffice/location");
        }}
      />
    </Box>
  );
};

export default LocationDetail;
