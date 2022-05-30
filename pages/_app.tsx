import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import axios from "axios";
import { UserProvider } from "../contexts/user-context";

axios.defaults.baseURL = "/api";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    // <SessionProvider session={pageProps.session}>
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
    // </SessionProvider>
  );
};

export default App;
