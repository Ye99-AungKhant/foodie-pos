import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import OrderAppFooter from "./OrderAppFooter";
import OrderAppHeader from "./OrderAppHeader";

interface Props {
  children: ReactNode;
}

const OrderLayout = (props: Props) => {
  const { isLoading, init } = useAppSelector((state) => state.app);
  const router = useRouter();
  const { tableId } = router.query;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (tableId && !init) {
      dispatch(fetchAppData({ tableId: Number(tableId) }));
    }
  }, [tableId]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "auto",
        pb: { xs: 10, md: 0 },
      }}
    >
      <OrderAppHeader />
      <Box>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              top: 200,
            }}
          >
            <CircularProgress size={80} />
          </Box>
        ) : (
          props.children
        )}
      </Box>
      <OrderAppFooter />
    </Box>
  );
};

export default OrderLayout;
