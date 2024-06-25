import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createAddonCategory } from "@/store/slices/addonCategorySlice";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { CreateAddonCategoryPayload } from "@/types/addonCategory";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MultiSelect from "./MultiSelect";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newAddonCategory: CreateAddonCategoryPayload;
  setNewAddonCategory: Dispatch<SetStateAction<CreateAddonCategoryPayload>>;
}

export function NewAddonCategoryDialog({
  open,
  setOpen,
  newAddonCategory,
  setNewAddonCategory,
}: Props) {
  const { menus } = useAppSelector((state) => state.menu);
  const [selected, setSelected] = useState<number[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setNewAddonCategory({ ...newAddonCategory, menuIds: selected });
  }, [selected]);

  const handleCreateAddonCategory = () => {
    if (!newAddonCategory.menuIds.length) {
      return dispatch(
        showSnackbar({
          type: "error",
          message: "Please select at least one menu",
        })
      );
    }
    dispatch(
      createAddonCategory({
        ...newAddonCategory,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "Created addon category successfully",
            })
          );
          setOpen(false);
        },
      })
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setSelected([]);
        setNewAddonCategory({
          name: "",
          isRequired: true,
          menuIds: [],
        });
      }}
    >
      <DialogTitle>New Addon Category</DialogTitle>
      <DialogContent sx={{ width: 300 }}>
        <TextField
          placeholder="Name"
          sx={{ width: "100%", mb: 2 }}
          onChange={(evt) =>
            setNewAddonCategory({ ...newAddonCategory, name: evt.target.value })
          }
        />
        <MultiSelect
          title="Menu"
          selected={selected}
          setSelected={setSelected}
          items={menus}
        />
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              onChange={(evt, value) =>
                setNewAddonCategory({
                  ...newAddonCategory,
                  isRequired: value,
                })
              }
            />
          }
          label="Required"
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
          onClick={handleCreateAddonCategory}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
