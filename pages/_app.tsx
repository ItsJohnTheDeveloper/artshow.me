import React from "react";
import { AppProps } from "next/app";
import axios from "axios";
import { useValidateUser } from "../contexts/user-context";

export const UserContext = React.createContext(null);

axios.defaults.baseURL = "/api";

const App = ({ Component, pageProps }: AppProps) => {
  const { user, setUser } = useValidateUser();
  console.log({ user });

  return (
    <UserContext.Provider value={{ state: { user }, setUser }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
};

export default App;
