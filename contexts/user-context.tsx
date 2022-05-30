import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";

const UserContext = React.createContext(null);

const UserProvider = ({ children }) => {
  const defaultValues = { user: null };
  const [state, setState] = useState(defaultValues);

  const value = useMemo(() => [state, setState], [state]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserContext");
  }

  const [state, setState] = context;

  const logOutUser = () => {
    setState({ user: null });
  };

  const signInUser = (value) => {
    setState({ user: value });
  };

  return {
    logOutUser,
    signInUser,
    getUser: state.user,
  };
};

// const useSidebar = () => {
//   const context = useContext(SidebarContext);
//   if (!context) {
//     throw new Error("useSidebar must be used within SidebarContext");
//   }
//   const [state, setState] = context;

//   const setIsHidden = (value) => {
//     setState({ ...state, isHidden: value });
//   };

//   const setIsCollapsed = (value) => {
//     setState({ ...state, isCollapsed: value });
//   };

//   return {
//     isHidden: state.isHidden,
//     isCollapsed: state.isCollapsed,
//     setIsHidden,
//     setIsCollapsed,
//   };
// };

export { UserProvider, useUser };
