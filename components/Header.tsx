import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
// import { signOut, useSession } from "next-auth/react";
import Spacer from "./Spacer";
import { Button, Typography } from "@mui/material";
import SignUpModal from "./Auth/SignUpModal";
import LoginModal from "./Auth/LoginModal";
import { useUser } from "../contexts/user-context";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // const { data: session, status } = useSession();

  const { getUser: user, logOutUser } = useUser();

  console.log({ user });

  const handleOpenSignUpModal = () => {
    setSignUpModalOpen(!signUpModalOpen);
  };

  const handleOpenLoginModal = () => {
    setLoginModalOpen(!loginModalOpen);
  };

  const handleLogOut = () => {
    logOutUser();
  };

  const LeftNav = () => {
    return (
      <div style={{ display: "flex" }}>
        <img src="/artcade-io-logo.png" style={{ height: 58 }} />
        <Spacer x={3} />
        <Link href="/">
          <a
            className="bold"
            data-active={isActive("/")}
            style={{ alignSelf: "center" }}
          >
            home
          </a>
        </Link>
      </div>
    );
  };

  const RightNav = () => {
    // if (status === "loading") {
    //   return <div>...loading</div>;
    // }

    if (!user) {
      return (
        <div style={{ display: "flex" }}>
          <Button variant="text" onClick={handleOpenLoginModal}>
            Login
          </Button>
          <Spacer x={1} />
          <Button variant="text" onClick={handleOpenSignUpModal}>
            Sign up
          </Button>
        </div>
      );
    }
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body1">{`Logged in as: ${user.info.email}`}</Typography>
        <Spacer x={1} />
        <Button variant="text" onClick={handleLogOut}>
          Log out
        </Button>
      </div>
    );
  };

  return (
    <nav
      style={{
        display: "flex",
        padding: "1rem",
        alignItems: "center",
        backgroundColor: "#14171c",
        justifyContent: "space-between",
      }}
    >
      <LeftNav />
      <RightNav />
      <SignUpModal open={signUpModalOpen} setOpen={setSignUpModalOpen} />
      <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen} />
    </nav>
  );
};

export default Header;
