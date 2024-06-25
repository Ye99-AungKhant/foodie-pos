import { useAppDispatch } from "@/store/hooks";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { createTable } from "@/store/slices/tableSlice";
import { CreateTablePayload } from "@/types/table";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface Props {
  newTable: CreateTablePayload;
  setNewTable: Dispatch<SetStateAction<CreateTablePayload>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NewTableDialog({
  newTable,
  setNewTable,
  open,
  setOpen,
}: Props) {
  const dispatch = useAppDispatch();
  const handleCreateTable = () => {
    const isValid = newTable.name && newTable.locationId;
    if (!isValid) {
      return dispatch(
        showSnackbar({ type: "error", message: "Missing required fields" })
      );
    }
    dispatch(
      createTable({
        ...newTable,
        onSuccess: () => {
          setOpen(false);
          dispatch(
            showSnackbar({
              type: "success",
              message: "Table created successfully",
            })
          );
        },
      })
    );
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setNewTable({ name: "", locationId: undefined });
      }}
    >
      <DialogTitle>New Table</DialogTitle>
      <DialogContent sx={{ width: "100%" }}>
        <TextField
          sx={{ mb: 2 }}
          value={newTable.name}
          onChange={(evt) =>
            setNewTable({ ...newTable, name: evt.target.value })
          }
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
          onClick={handleCreateTable}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
