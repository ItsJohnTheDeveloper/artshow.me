import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Spacer from "./Spacer";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Menu, Close, Logout, ContactPage } from "@mui/icons-material";
import SignUpModal from "./Modal/Auth/SignUpModal";
import LoginModal from "./Modal/Auth/LoginModal";
import { useUser } from "../contexts/user-context";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const { getUser: authedUser, logOutUser } = useUser();

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
        <Link href="/">
          <a
            className="bold"
            data-active={isActive("/")}
            style={{ alignSelf: "center" }}
          >
            <img src="/artcade-io-logo.png" style={{ height: 58 }} />
          </a>
        </Link>
        <Spacer x={3} />
      </div>
    );
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setSideDrawerOpen(open);
  };

  const RightNav = () => {
    if (!authedUser) {
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
        <Spacer x={1} />
        <>
          <IconButton
            onClick={toggleDrawer(true)}
            color="primary"
            component="span"
          >
            <Menu />
          </IconButton>
          <Drawer
            anchor={"right"}
            open={sideDrawerOpen}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <ListItem key="Close" disablePadding>
                <ListItemButton style={{ paddingTop: 25, paddingBottom: 25 }}>
                  <ListItemIcon>
                    <Close />
                  </ListItemIcon>
                  <ListItemText primary={"Close"} />
                </ListItemButton>
              </ListItem>
              <Divider />
              <Link href={`/artist/${authedUser.id}`}>
                <a style={{ textDecoration: "none" }}>
                  <ListItem key="My Profile" disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <ContactPage />
                      </ListItemIcon>
                      <ListItemText primary={"My Profile"} />
                    </ListItemButton>
                  </ListItem>
                </a>
              </Link>
              <Divider />
              <ListItem key="Logout" disablePadding onClick={handleLogOut}>
                <ListItemButton>
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary={"Logout"} />
                </ListItemButton>
              </ListItem>
            </Box>
          </Drawer>
        </>
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
