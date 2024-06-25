import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createAddon } from "@/store/slices/addonSlice";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { CreateAddonPayload } from "@/types/addon";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SingleSelect from "./SingleSelect";

interface Props {
  newAddon: CreateAddonPayload;
  setNewAddon: Dispatch<SetStateAction<CreateAddonPayload>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NewAddonDialog({
  newAddon,
  setNewAddon,
  open,
  setOpen,
}: Props) {
  const [selected, setSelected] = useState<number>();
  const { addonCategories } = useAppSelector((state) => state.addonCategory);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selected) {
      setNewAddon({ ...newAddon, addonCategoryId: selected });
    }
  }, [selected]);
  const handleCreateAddon = () => {
    const isValid = newAddon.name && newAddon.addonCategoryId;
    if (!isValid)
      return dispatch(
        showSnackbar({ type: "error", message: "Please select addon category" })
      );
    dispatch(
      createAddon({
        ...newAddon,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "Created addon successfully",
            })
          );
          setOpen(false);
        },
      })
    );
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>New Addon</DialogTitle>
      <DialogContent sx={{ width: 300 }}>
        <TextField
          placeholder="Name"
          sx={{ width: "100%", mb: 2 }}
          onChange={(evt) =>
            setNewAddon({ ...newAddon, name: evt.target.value })
          }
        />
        <TextField
          placeholder="Price"
          sx={{ width: "100%", mb: 2 }}
          onChange={(evt) =>
            setNewAddon({ ...newAddon, price: Number(evt.target.value) })
          }
        />
        <SingleSelect
          title="Addon Category"
          selected={selected}
          setSelected={setSelected}
          items={addonCategories}
        />
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
          onClick={handleCreateAddon}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
