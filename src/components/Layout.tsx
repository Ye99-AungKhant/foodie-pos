import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import BackofficeLayout from "./BackofficeAppLayout";
import OrderAppLayout from "./OrderAppLayout";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const router = useRouter();
  const { tableId } = router.query;
  const pathname = router.pathname;
  const isBackofficeApp = pathname.includes("backoffice");
  const isOrderApp = tableId;
  if (isBackofficeApp) {
    return <BackofficeLayout>{children}</BackofficeLayout>;
  }
  if (isOrderApp) {
    return <OrderAppLayout>{children}</OrderAppLayout>;
  }

  return <Box>{children}</Box>;
};

export default Layout;
