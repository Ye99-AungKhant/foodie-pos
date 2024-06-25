import DeleteDialog from "@/components/DeleteDialog";
import MultiSelect from "@/components/MultiSelect";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { deleteMenu, updateMenu } from "@/store/slices/menuSlice";
import { UpdateMenuPayload } from "@/types/menu";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { MenuCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MenuDetail = () => {
  const [open, setOpen] = useState(false);
  const [updateData, setUpdateData] = useState<UpdateMenuPayload>();
  const [selected, setSelected] = useState<number[]>([]);
  const router = useRouter();
  const menuId = Number(router.query.id);
  const { menus } = useAppSelector((state) => state.menu);
  const { menuCategories } = useAppSelector((state) => state.menuCategory);
  const menu = menus.find((item) => item.id === menuId);
  const { menuCategoryMenus } = useAppSelector(
    (state) => state.menuCategoryMenu
  );
  const selectedLocation = useAppSelector(
    (state) => state.app.selectedLocation
  );
  const { disabledLocationMenus } = useAppSelector(
    (state) => state.disabledLocationMenu
  );
  const isAvailable = disabledLocationMenus.find(
    (item) => item.locationId === selectedLocation?.id && item.menuId === menuId
  )
    ? false
    : true;

  const dispatch = useAppDispatch();
  const selectedMenuCategoryIds = menuCategoryMenus
    .filter((item) => item.menuId === menuId)
    .map((item) => {
      const menuCategory = menuCategories.find(
        (menuCategory) => menuCategory.id === item.menuCategoryId
      ) as MenuCategory;
      return menuCategory.id;
    });

  useEffect(() => {
    if (menu) {
      setUpdateData(menu);
      setSelected(selectedMenuCategoryIds);
    }
  }, [menu]);

  useEffect(() => {
    if (updateData) {
      setUpdateData({
        ...updateData,
        locationId: selectedLocation?.id,
        isAvailable,
        menuCategoryIds: selected,
      });
    }
  }, [selected]);

  if (!updateData) {
    return (
      <Box>
        <Typography>Menu not found</Typography>
      </Box>
    );
  }

  const handleUpdateMenu = () => {
    if (!updateData.menuCategoryIds?.length) {
      return dispatch(
        showSnackbar({
          type: "error",
          message: "Please select at least one menu category.",
        })
      );
    }
    dispatch(
      updateMenu({
        ...updateData,
        onSuccess: () => router.push("/backoffice/menu"),
      })
    );
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
        <MultiSelect
          title="Menu Category"
          selected={selected}
          setSelected={setSelected}
          items={menuCategories}
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
          onClick={handleUpdateMenu}
        >
          Update
        </Button>
      </Box>
      <DeleteDialog
        open={open}
        setOpen={setOpen}
        title="Delete Menu"
        content="Are you sure you want to delete this menu?"
        handleDelete={() => {
          dispatch(deleteMenu({ id: menuId }));
          setOpen(false);
          router.push("/backoffice/menu");
        }}
      />
    </Box>
  );
};

export default MenuDetail;
