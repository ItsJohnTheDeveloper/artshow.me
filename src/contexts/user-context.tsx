import { useContext, useEffect, useState } from "react";
import { UserContext } from "../pages/_app";
import {
  clearLocalStorage,
  getAndAuthenticateUser,
} from "../utils/auth/authenticateUser";

type signInUserProps = {
  accessToken: string;
  refreshToken: string;
  id: string;
};

type useUserProps = {
  logOutUser: Function;
  setUser: any;
  getUser: signInUserProps;
};

const setUserLocalStorage = (refreshToken, accessToken, id) => {
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("_id", id);
};

const useValidateUser = () => {
  const [user, setUser] = useState(null);

  const setMountedUser = (value) => {
    const { refreshToken, accessToken, id } = value;

    setUser(value);
    // set local storage with tokens and user id
    setUserLocalStorage(refreshToken, accessToken, id);
  };

  useEffect(() => {
    const fetchAuthedUser = async () => {
      const authedUser = await getAndAuthenticateUser(user);
      if (authedUser) {
        setMountedUser(authedUser);
      }
    };

    fetchAuthedUser();
  }, []);

  return { user, setUser };
};

const useUser = (): useUserProps => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserContext");
  }
  const { state, setUser } = context;

  const logOutUser = () => {
    setUser(null);
    clearLocalStorage();
  };

  const setAuthedUser = (value: signInUserProps) => {
    const { refreshToken, accessToken, id } = value;

    setUser(value);
    // set local storage with tokens and user id
    setUserLocalStorage(refreshToken, accessToken, id);
  };

  return {
    logOutUser,
    setUser: setAuthedUser,
    getUser: state?.user,
  };
};

export { useValidateUser, useUser };
