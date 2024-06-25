import DeleteDialog from "@/components/DeleteDialog";
import SingleSelect from "@/components/SingleSelect";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateAddon } from "@/store/slices/addonSlice";
import { UpdateAddonPayload } from "@/types/addon";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AddonDetail = () => {
  const [open, setOpen] = useState(false);
  const [updateData, setUpdateData] = useState<UpdateAddonPayload>();
  const router = useRouter();
  const addonId = Number(router.query.id);
  const { addons } = useAppSelector((state) => state.addon);
  const addon = addons.find((item) => item.id === addonId);
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<number>();
  const { addonCategories } = useAppSelector((state) => state.addonCategory);

  useEffect(() => {
    if (addon) {
      setUpdateData(addon);
      setSelected(addon.addonCategoryId);
    }
  }, [addon]);

  useEffect(() => {
    if (updateData && selected) {
      setUpdateData({ ...updateData, addonCategoryId: selected });
    }
  }, [selected]);

  if (!updateData) {
    return (
      <Box>
        <Typography>Addon not found</Typography>
      </Box>
    );
  }

  const handleUpdate = () => {
    dispatch(updateAddon(updateData));
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
        <TextField
          sx={{ mb: 2 }}
          value={updateData.price}
          onChange={(evt) =>
            setUpdateData({ ...updateData, price: Number(evt.target.value) })
          }
        />
        <SingleSelect
          title="Addon Category"
          selected={selected}
          setSelected={setSelected}
          items={addonCategories}
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
        title="Delete Addon"
        content="Are you sure you want to delete this addon?"
        handleDelete={() => {
          /* dispatch(deleteLocation({ id: locationId }));
          setOpen(false);
          router.push("/backoffice/location"); */
        }}
      />
    </Box>
  );
};

export default AddonDetail;
