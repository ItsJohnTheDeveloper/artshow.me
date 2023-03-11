import React from "react";
import { AppProps } from "next/app";
import axios from "axios";
import { SessionProvider } from "next-auth/react";

axios.defaults.baseURL = "/api";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
