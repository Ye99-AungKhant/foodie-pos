import Layout from "@/components/Layout";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { store } from "@/store";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ThemeProviderWrapper>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProviderWrapper>
      </Provider>
    </SessionProvider>
  );
}
