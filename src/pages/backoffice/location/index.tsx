import ItemCard from "@/components/ItemCard";
import { NewLocationDialog } from "@/components/NewLocationDialog";
import { useAppSelector } from "@/store/hooks";
import { CreateLocationPayload } from "@/types/location";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const Location = () => {
  const { company } = useAppSelector((state) => state.company);
  const [newLocation, setNewLocation] = useState<CreateLocationPayload>({
    name: "",
    street: "",
    township: "",
    city: "",
    companyId: company?.id,
  });
  const [open, setOpen] = useState(false);
  const { locations } = useAppSelector((state) => state.location);
  return (
    <Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="contained" onClick={() => setOpen(true)}>
            New Location
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex" }}>
        {locations.map((item) => (
          <ItemCard
            key={item.id}
            icon={<LocationOnIcon />}
            title={item.name}
            href={`/backoffice/location/${item.id}`}
            isAvailable
          />
        ))}
      </Box>
      <NewLocationDialog
        open={open}
        setOpen={setOpen}
        newLocation={newLocation}
        setNewLocation={setNewLocation}
      />
    </Box>
  );
};

export default Location;
