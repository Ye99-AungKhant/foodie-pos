import ItemCard from "@/components/ItemCard";
import { NewAddonDialog } from "@/components/NewAddonDialog";
import { useAppSelector } from "@/store/hooks";
import { CreateAddonPayload } from "@/types/addon";
import EggIcon from "@mui/icons-material/Egg";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const Addon = () => {
  const [newAddon, setNewAddon] = useState<CreateAddonPayload>({
    name: "",
    price: 0,
    addonCategoryId: undefined,
  });
  const { addons } = useAppSelector((state) => state.addon);
  const [open, setOpen] = useState(false);
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
            New Addon
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {addons.map((item) => (
          <ItemCard
            key={item.id}
            icon={<EggIcon />}
            title={item.name}
            href={`/backoffice/addon/${item.id}`}
            isAvailable
          />
        ))}
      </Box>
      <NewAddonDialog
        newAddon={newAddon}
        setNewAddon={setNewAddon}
        open={open}
        setOpen={setOpen}
      />
    </Box>
  );
};

export default Addon;
