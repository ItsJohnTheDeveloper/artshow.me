import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";
import axios from "axios";
import { useValidateUser } from "../contexts/user-context";

export const UserContext = React.createContext(null);

axios.defaults.baseURL = "/api";

const App = ({ Component, pageProps }: AppProps) => {
  const { user, setUser } = useValidateUser();
  console.log({ user });

  // const [userCount, setUserCount] = useState(null);
  // useEffect(() => {
  //   fetch("/api/users/userCount")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setUserCount(data);
  //     });
  // }, []);

  // console.log({ userCount });

  return (
    <UserContext.Provider value={{ state: { user }, setUser }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
};

export default App;
