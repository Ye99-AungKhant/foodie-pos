import ItemCard from "@/components/ItemCard";
import { NewMenuCategoryDialog } from "@/components/NewMenuCategoryDialog";
import { useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import { CreateMenuCategoryPayload } from "@/types/menuCategory";
import CategoryIcon from "@mui/icons-material/Category";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { shallowEqual } from "react-redux";

const MenuCategory = () => {
  const {
    menuCategories,
    disabledLocationMenuCategories,
    selectedLocation,
    company,
  } = useAppSelector(appDataSelector, shallowEqual);
  const [open, setOpen] = useState<boolean>(false);
  const [newMenuCategory, setNewMenuCategory] =
    useState<CreateMenuCategoryPayload>({
      name: "",
      isAvailable: true,
      companyId: company?.id,
    });
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
            New Menu Category
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexWrap: 'wrap' }}>
        {menuCategories.map((menuCategoy) => {
          const isAvailable = disabledLocationMenuCategories.find(
            (item) =>
              item.menuCategoryId === menuCategoy.id &&
              item.locationId === selectedLocation?.id
          )
            ? false
            : true;
          return (
            <ItemCard
              key={menuCategoy.id}
              icon={<CategoryIcon />}
              title={menuCategoy.name}
              href={`/backoffice/menu-category/${menuCategoy.id}`}
              isAvailable={isAvailable}
            />
          );
        })}
      </Box>
      <NewMenuCategoryDialog
        open={open}
        setOpen={setOpen}
        newMenuCategory={newMenuCategory}
        setNewMenuCategory={setNewMenuCategory}
      />
    </Box>
  );
};

export default MenuCategory;
