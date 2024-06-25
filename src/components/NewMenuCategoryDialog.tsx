import { useAppDispatch } from "@/store/hooks";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { createMenuCategory } from "@/store/slices/menuCategorySlice";
import { CreateMenuCategoryPayload } from "@/types/menuCategory";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newMenuCategory: CreateMenuCategoryPayload;
  setNewMenuCategory: Dispatch<SetStateAction<CreateMenuCategoryPayload>>;
}

export function NewMenuCategoryDialog({
  open,
  setOpen,
  newMenuCategory,
  setNewMenuCategory,
}: Props) {
  const dispatch = useAppDispatch();
  const handleCreateMenuCategory = () => {
    const isValid = newMenuCategory.name;
    if (!isValid) return;
    dispatch(
      createMenuCategory({
        ...newMenuCategory,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "Menu category created successfully",
            })
          );
          setOpen(false);
        },
        onError: () => {
          dispatch(
            showSnackbar({
              type: "error",
              message: "Error occurred when creating menu category",
            })
          );
        },
      })
    );
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>New Menu Category</DialogTitle>
      <DialogContent sx={{ width: 300 }}>
        <Box>
          <TextField
            placeholder="name"
            sx={{ width: "100%", mb: 2 }}
            onChange={(evt) =>
              setNewMenuCategory({ ...newMenuCategory, name: evt.target.value })
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newMenuCategory.isAvailable}
                onChange={(evt, value) =>
                  setNewMenuCategory({ ...newMenuCategory, isAvailable: value })
                }
              />
            }
            label="Available"
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
          onClick={handleCreateMenuCategory}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
