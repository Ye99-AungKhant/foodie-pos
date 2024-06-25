import Layout from "@/components/BackofficeAppLayout";
import { Box, Button } from "@mui/material";
import { signIn } from "next-auth/react";

// Custom sign in page
const SignIn = () => {
  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Button
          sx={{ bgcolor: "#4C4C6D", "&:hover": { bgcolor: "#66667c" } }}
          variant="contained"
          onClick={() => signIn("google", { callbackUrl: "/backoffice" })}
        >
          Sign in with Google
        </Button>
      </Box>
    </Layout>
  );
};

export default SignIn;
