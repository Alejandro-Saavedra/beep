import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Quack</title>
        <meta name="description" content="🦆" />
        <link rel="icon" href="/ComputerFace.gif" />
      </Head>

      <Toaster position="bottom-center" reverseOrder={false} />

      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
