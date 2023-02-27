import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut, signIn } from "next-auth/react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { Menu, Close, Logout, ContactPage, Search } from "@mui/icons-material";
import SignUpModal from "./Modal/Auth/SignUpModal";
import LoginModal from "./Modal/Auth/LoginModal";
import Spacer from "./Spacer";
import theme from "../styles/theme";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session } = useSession();

  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const CenterNav = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            height: "38px",
            display: "flex",
            alignItems: "flex-end",
            backgroundColor: "#3c3c50",
            borderRadius: "24px",
            padding: "2px 14px",
          }}
        >
          <Search sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            InputProps={{ disableUnderline: true }}
            id="input-with-sx"
            label="Search for art"
            variant="standard"
            size="small"
            fullWidth
            disabled // TODO: enable search
          />
        </Box>
        <Spacer y={1} />
        <div style={{ display: "flex", alignSelf: "center" }}>
          {["Paintings", "Murals", "Books", "Sculptures", "Collections"].map(
            (item) => (
              <div style={{ paddingRight: 13 }} key={item}>
                <Link href="/" legacyBehavior>
                  <a>
                    <Typography variant="caption" display="block">
                      {item}
                    </Typography>
                  </a>
                </Link>
              </div>
            )
          )}
        </div>
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
    if (!session?.user) {
      return (
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button variant="text" onClick={() => signIn()}>
            log in
          </Button>
          <Spacer x={1} />
        </div>
      );
    }
    return (
      <div style={{ display: "flex", justifyContent: "end" }}>
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
              <Link href={`/artist/${session.user.id}`} legacyBehavior>
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
              <ListItem key="Logout" disablePadding onClick={() => signOut()}>
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
        top: 0,
        position: "sticky",
        zIndex: 100,
        padding: "8px",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs>
          <Link href="/" legacyBehavior>
            <a
              className="bold"
              data-active={isActive("/")}
              style={{ alignSelf: "center" }}
            >
              <img src="/artcade-io-logo.png" style={{ height: 48 }} />
            </a>
          </Link>
        </Grid>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={6}>
          <CenterNav />
        </Grid>
        <Grid item xs>
          <RightNav />
        </Grid>
      </Grid>

      <SignUpModal open={signUpModalOpen} setOpen={setSignUpModalOpen} />
      <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen} />
    </nav>
  );
};

export default Header;
