import ItemCard from "@/components/ItemCard";
import { NewAddonCategoryDialog } from "@/components/NewAddonCategoryDialog";
import { useAppSelector } from "@/store/hooks";
import { CreateAddonCategoryPayload } from "@/types/addonCategory";
import ClassIcon from "@mui/icons-material/Class";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const AddonCategory = () => {
  const [newAddonCategory, setNewAddonCategory] =
    useState<CreateAddonCategoryPayload>({
      name: "",
      isRequired: true,
      menuIds: [],
    });
  const { addonCategories } = useAppSelector((state) => state.addonCategory);
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
            New Addon Category
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex" }}>
        {addonCategories.map((item) => (
          <ItemCard
            key={item.id}
            icon={<ClassIcon />}
            title={item.name}
            href={`/backoffice/addon-category/${item.id}`}
            isAvailable
          />
        ))}
      </Box>
      <NewAddonCategoryDialog
        open={open}
        setOpen={setOpen}
        newAddonCategory={newAddonCategory}
        setNewAddonCategory={setNewAddonCategory}
      />
    </Box>
  );
};

export default AddonCategory;
