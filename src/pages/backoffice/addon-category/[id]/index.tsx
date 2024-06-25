import DeleteDialog from "@/components/DeleteDialog";
import MultiSelect from "@/components/MultiSelect";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteAddonCategory,
  updateAddonCategory,
} from "@/store/slices/addonCategorySlice";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { UpdateAddonCategoryPayload } from "@/types/addonCategory";
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

const AddonCategoryDetail = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [updateData, setUpdateData] = useState<UpdateAddonCategoryPayload>();
  const router = useRouter();
  const addonCategoryId = Number(router.query.id);
  const { addonCategories } = useAppSelector((state) => state.addonCategory);
  const addonCategory = addonCategories.find(
    (item) => item.id === addonCategoryId
  );
  const { menuAddonCategories } = useAppSelector(
    (state) => state.menuAddonCategory
  );
  const { company } = useAppSelector((state) => state.company);
  const { menus } = useAppSelector((state) => state.menu);
  const selectedMenuIds = menuAddonCategories
    .filter((item) => item.addonCategoryId === addonCategoryId)
    .map((item) => item.menuId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (addonCategory) {
      setUpdateData({
        ...addonCategory,
        menuIds: selectedMenuIds,
        companyId: company?.id,
      });
      setSelected(selectedMenuIds);
    }
  }, [addonCategory]);

  useEffect(() => {
    if (updateData) {
      setUpdateData({
        ...updateData,
        menuIds: selected,
        companyId: company?.id,
      });
    }
  }, [selected]);

  if (!updateData) {
    return (
      <Box>
        <Typography>Addon category not found</Typography>
      </Box>
    );
  }

  const handleUpdate = () => {
    if (!updateData.menuIds.length) {
      return dispatch(
        showSnackbar({
          type: "error",
          message: "Please select at least one menu.",
        })
      );
    }
    dispatch(
      updateAddonCategory({
        ...updateData,
        onSuccess: () => router.push("/backoffice/addon-category"),
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
        <MultiSelect
          title="Menu"
          selected={selected}
          setSelected={setSelected}
          items={menus}
        />
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={updateData.isRequired}
              onChange={(evt, value) =>
                setUpdateData({ ...updateData, isRequired: value })
              }
            />
          }
          label="Required"
          sx={{ mb: 4 }}
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
        title="Delete Addon Category"
        content="Are you sure you want to delete this addon category?"
        handleDelete={() => {
          dispatch(
            deleteAddonCategory({
              id: addonCategoryId,
              onSuccess: () => {
                dispatch(
                  showSnackbar({
                    type: "success",
                    message: "Deleted addon category successfully",
                  })
                );
              },
            })
          );
          setOpen(false);
          router.push("/backoffice/addon-category");
        }}
      />
    </Box>
  );
};

export default AddonCategoryDetail;
