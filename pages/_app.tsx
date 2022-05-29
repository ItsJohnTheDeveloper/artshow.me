import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import axios from "axios";

axios.defaults.baseURL = "/api";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
