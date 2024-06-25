import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";

import { uploadAsset } from "@/store/slices/appSlice";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { createMenu } from "@/store/slices/menuSlice";
import { CreateMenuPayload } from "@/types/menu";
import { MenuCategory } from "@prisma/client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import FileDropZone from "./FileDropZone";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newMenu: CreateMenuPayload;
  setNewMenu: React.Dispatch<React.SetStateAction<CreateMenuPayload>>;
}

export function NewMenuDialog({ open, setOpen, newMenu, setNewMenu }: Props) {
  const { isLoading } = useAppSelector((state) => state.menu);
  const { menuCategories } = useAppSelector((state) => state.menuCategory);
  const dispatch = useAppDispatch();
  const [menuImage, setMenuImage] = useState<File>();

  const handleCreateMenu = async () => {
    const isValid = newMenu.name && newMenu.menuCategoryIds.length > 0;
    if (!isValid) return;
    if (menuImage) {
      dispatch(
        uploadAsset({
          file: menuImage,
          onSuccess: (assetUrl) => {
            newMenu.assetUrl = assetUrl;
            dispatch(
              createMenu({
                ...newMenu,
                onSuccess: () => {
                  dispatch(
                    showSnackbar({
                      type: "success",
                      message: "Menu created successfully",
                    })
                  );
                  setOpen(false);
                },
                onError: () => {
                  dispatch(
                    showSnackbar({
                      type: "error",
                      message: "Error occurred when creating menu",
                    })
                  );
                },
              })
            );
          },
        })
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setMenuImage(undefined);
        setNewMenu({
          name: "",
          price: 0,
          menuCategoryIds: [],
        });
      }}
    >
      <DialogTitle>New Menu</DialogTitle>
      <DialogContent sx={{ width: 400 }}>
        <Box>
          <TextField
            placeholder="name"
            sx={{ width: "100%", mb: 2 }}
            onChange={(evt) =>
              setNewMenu({ ...newMenu, name: evt.target.value })
            }
          />
          <TextField
            type="number"
            placeholder="price"
            sx={{ width: "100%", mb: 2 }}
            onChange={(evt) =>
              setNewMenu({ ...newMenu, price: Number(evt.target.value) })
            }
          />
          <FormControl sx={{ width: "100%", mb: 2 }}>
            <InputLabel>Menu Category</InputLabel>
            <Select
              value={newMenu.menuCategoryIds}
              multiple
              onChange={(evt) => {
                const selected = evt.target.value as number[];
                setNewMenu({ ...newMenu, menuCategoryIds: selected });
              }}
              renderValue={() => {
                const selectedMenuCategories = newMenu.menuCategoryIds.map(
                  (selectedId) =>
                    menuCategories.find(
                      (item) => item.id === selectedId
                    ) as MenuCategory
                );
                return selectedMenuCategories
                  .map((item) => item.name)
                  .join(", ");
              }}
              input={<OutlinedInput label="Menu Category" />}
            >
              {menuCategories.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    <Checkbox
                      checked={newMenu.menuCategoryIds.includes(item.id)}
                    />
                    <ListItemText primary={item.name} />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Box>
            <FileDropZone onDrop={(files) => setMenuImage(files[0])} />
            {menuImage && (
              <Chip
                sx={{ mt: 2 }}
                label={menuImage.name}
                onDelete={() => setMenuImage(undefined)}
              />
            )}
          </Box>
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
          onClick={handleCreateMenu}
        >
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: "#E8F6EF" }} />
          ) : (
            "Create"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
