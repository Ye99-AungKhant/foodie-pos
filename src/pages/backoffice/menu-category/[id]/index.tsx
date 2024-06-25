import DeleteDialog from "@/components/DeleteDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import {
  deleteMenuCategory,
  updateMenuCategory,
} from "@/store/slices/menuCategorySlice";
import { UpdateMenuCategoryPayload } from "@/types/menuCategory";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MenuCategoryDetail = () => {
  const [open, setOpen] = useState(false);
  const [updateData, setUpdateData] = useState<UpdateMenuCategoryPayload>();
  const router = useRouter();
  const menuCategoryId = Number(router.query.id);
  const { menuCategories } = useAppSelector((state) => state.menuCategory);
  const menuCategory = menuCategories.find(
    (item) => item.id === menuCategoryId
  );
  const { selectedLocation } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const { disabledLocationMenuCategories } = useAppSelector(
    (state) => state.disabledLocationMenuCategory
  );
  const isAvailable = disabledLocationMenuCategories.find(
    (item) =>
      item.menuCategoryId === menuCategoryId &&
      item.locationId === selectedLocation?.id
  )
    ? false
    : true;

  useEffect(() => {
    if (menuCategory) {
      setUpdateData({
        ...menuCategory,
        isAvailable,
        locationId: selectedLocation?.id,
      });
    }
  }, [menuCategory]);

  const handleUpdate = () => {
    /* const shouldUpdate = updateData?.name !== menuCategory?.name;
    if (!shouldUpdate) {
      return router.push("/backoffice/menu-category");
    } */
    updateData &&
      dispatch(
        updateMenuCategory({
          ...updateData,
          onSuccess: () => {
            dispatch(
              showSnackbar({
                type: "success",
                message: "Updated menu category created successfully",
              })
            );
            router.push("/backoffice/menu-category");
          },
        })
      );
  };

  if (!updateData) {
    return (
      <Box>
        <Typography>Menu category not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
          Delete
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 500 }}>
        <TextField
          value={updateData.name}
          onChange={(evt) =>
            setUpdateData({ ...updateData, name: evt.target.value })
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={isAvailable}
              onChange={(evt, value) =>
                setUpdateData({ ...updateData, isAvailable: value })
              }
            />
          }
          label="Available"
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
        title="Delete Menu Category"
        content="Are you sure you want to delete this menu category?"
        handleDelete={() => {
          dispatch(deleteMenuCategory({ id: menuCategoryId }));
          setOpen(false);
          router.push("/backoffice/menu-category");
        }}
      />
    </Box>
  );
};

export default MenuCategoryDetail;
