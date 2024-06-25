import DeleteDialog from "@/components/DeleteDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import {
  deleteTable,
  selectTables,
  updateTable,
} from "@/store/slices/tableSlice";
import { UpdateTablePayload } from "@/types/table";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const TableDetail = () => {
  const [open, setOpen] = useState(false);
  const [updateData, setUpdateData] = useState<UpdateTablePayload>();
  const router = useRouter();
  const tableId = Number(router.query.id);
  const tables = useAppSelector(selectTables);
  const table = tables.find((item) => item.id === tableId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (table) {
      setUpdateData(table);
    }
  }, [table]);

  if (!updateData) {
    return (
      <Box>
        <Typography>Table not found</Typography>
      </Box>
    );
  }

  const handleUpdate = () => {
    dispatch(
      updateTable({
        ...updateData,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "Table updated successfully",
            })
          );
          router.push("/backoffice/table");
        },
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
        title="Delete table"
        content="Are you sure you want to delete this table?"
        handleDelete={() => {
          dispatch(
            deleteTable({
              id: tableId,
              onSuccess: () => {
                dispatch(
                  showSnackbar({
                    type: "success",
                    message: "Deleted table successfully.",
                  })
                );
              },
            })
          );
          setOpen(false);
          router.push("/backoffice/table");
        }}
      />
    </Box>
  );
};

export default TableDetail;
