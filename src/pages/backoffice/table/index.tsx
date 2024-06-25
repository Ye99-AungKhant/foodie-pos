import ItemCard from "@/components/ItemCard";
import { NewTableDialog } from "@/components/NewTableDialog";
import { useAppSelector } from "@/store/hooks";
import { selectTables } from "@/store/slices/tableSlice";
import { CreateTablePayload } from "@/types/table";
import TableBarIcon from "@mui/icons-material/TableBar";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";

const Table = () => {
  const { selectedLocation } = useAppSelector((state) => state.app);
  const [newTable, setNewTable] = useState<CreateTablePayload>({
    name: "",
    locationId: undefined,
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedLocation) {
      setNewTable({ ...newTable, locationId: selectedLocation.id });
    }
  }, [selectedLocation]);

  const tables = useAppSelector(selectTables).filter(
    (item) => item.locationId === selectedLocation?.id
  );

  const handleQRImagePrint = (assetUrl: string) => {
    const imageWindow = window.open("");
    imageWindow?.document.write(
      `<html><head><title>Print Image</title></head><body style="text-align: center;"><img src="${assetUrl}" onload="window.print();window.close()" /></body></html>`
    );
  };

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
            New table
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {tables.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ItemCard
                icon={<TableBarIcon />}
                title={item.name}
                href={`/backoffice/table/${item.id}`}
                isAvailable
              />
              <Button
                variant="contained"
                sx={{
                  width: "fit-content",
                  bgcolor: "#4C4C6D",
                  "&:hover": { bgcolor: "#66667c" },
                }}
                onClick={() => handleQRImagePrint(item.assetUrl)}
              >
                Print QR
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
      <NewTableDialog
        newTable={newTable}
        setNewTable={setNewTable}
        open={open}
        setOpen={setOpen}
      />
    </Box>
  );
};

export default Table;
