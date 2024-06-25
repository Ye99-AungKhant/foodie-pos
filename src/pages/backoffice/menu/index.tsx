import MenuCard from "@/components/MenuCard";
import { NewMenuDialog } from "@/components/NewMenuDialog";
import { useAppSelector } from "@/store/hooks";
import { CreateMenuPayload } from "@/types/menu";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const Menu = () => {
  const { menus } = useAppSelector((state) => state.menu);
  const [open, setOpen] = useState(false);
  const [newMenu, setNewMenu] = useState<CreateMenuPayload>({
    name: "",
    price: 0,
    menuCategoryIds: [],
  });
  const { selectedLocation } = useAppSelector((state) => state.app);
  const { disabledLocationMenus } = useAppSelector(
    (state) => state.disabledLocationMenu
  );
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
            New Menu
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
          {menus.map((menu) => {
            const isAvailable = disabledLocationMenus.find(
              (item) =>
                item.menuId === menu.id &&
                item.locationId === selectedLocation?.id
            )
              ? false
              : true;
            return (
              <MenuCard
                key={menu.id}
                menu={menu}
                href={`/backoffice/menu/${menu.id}`}
                isAvailable={isAvailable}
              />
            );
          })}
        </Box>
        <NewMenuDialog
          open={open}
          setOpen={setOpen}
          newMenu={newMenu}
          setNewMenu={setNewMenu}
        />
      </Box>
    </Box>
  );
};

export default Menu;
