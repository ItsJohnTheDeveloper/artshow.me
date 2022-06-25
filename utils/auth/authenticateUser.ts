import axios from "axios";

const getLocalStorage = () => {
  console.log("getting items from localstorage");
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  const id = localStorage.getItem("_id");

  return { refreshToken, accessToken, id };
};

export const clearLocalStorage = () => {
  console.log("removing localstorage");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("_id");
};

export const getAndAuthenticateUser = async (user) => {
  let authedUser = user;

  if (user) {
    console.log("user found in state!");
    return authedUser;
  }

  const { refreshToken, accessToken, id } = getLocalStorage();

  const storedUser = refreshToken && accessToken && id;
  if (!storedUser) {
    console.log("No user detected in localstorage, please login.");
    return;
  }

  try {
    console.log("authenticating refreshToken...");

    const response = await axios.post("/auth/refreshToken", {
      refreshToken: refreshToken,
    });

    const refreshTokenRes = response.data?.refreshToken;

    authedUser = { accessToken, refreshToken: refreshTokenRes, id };
  } catch (err) {
    authedUser = null;
    if (err?.response?.status === 401) {
      console.log("unauthorized");
      clearLocalStorage();
    }
    if (err?.response?.data.includes("jwt expired")) {
      // remove localstorage as jwt expired.
      clearLocalStorage();
    }
  }

  return authedUser;
};
