import { Box } from "@mui/material";
import { useSession } from "next-auth/react";

const BackofficeApp = () => {
  const { data } = useSession();
  return (
    <Box>
      <h1>Backoffice App {data?.user?.email}</h1>
    </Box>
  );
};

export default BackofficeApp;
