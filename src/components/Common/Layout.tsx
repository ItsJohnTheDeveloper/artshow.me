import React from "react";
import { Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "./Header";
import theme from "../../styles/theme";
import Footer from "./Footer";

const breadCrumbStyles = {
  padding: "14px 24px",
  fontSize: 21,
  position: "absolute",
  backgroundColor: theme.palette.background.default + "de",
  borderRadius: 32,
  margin: 14,
  fontWeight: "bold",
};

const StyledBreadCrumbs = () => {
  const router = useRouter();

  const url = router.asPath;
  const crumbs = url.split("/");

  const links = {
    home: `/`,
    artist: crumbs[2] && `/artist/${crumbs[2]}`,
    collection:
      crumbs[2] && crumbs[4] && `/artist/${crumbs[2]}/collection/${crumbs[4]}`,
  };

  return (
    // @ts-expect-error
    <div style={breadCrumbStyles}>
      <Link href={links.home} legacyBehavior>
        <a
          style={{
            textDecoration: "auto",
            color: "#a7a7ff",
          }}
        >
          Home{" "}
        </a>
      </Link>
      {url.includes(links.artist) && !url.includes("collection")
        ? ` / Artist `
        : links.artist && (
            <Link href={links.artist} legacyBehavior>
              <a style={{ textDecoration: "auto", color: "#a7a7ff" }}>
                / Artist
              </a>
            </Link>
          )}
      {links.collection && ` / Collection`}
    </div>
  );
};

type LayoutProps = {
  children: React.ReactNode;
  pageSpacing?: boolean;
  showCrumbs?: boolean;
};
// bg color: #202225
const Layout = ({ children, pageSpacing, showCrumbs = false }: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Header />

      <Grid
        container
        justifyContent={"center"}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={pageSpacing ? 11 : 12}
          lg={pageSpacing ? 11 : 12}
          xl={pageSpacing ? 8 : 12}
        >
          {showCrumbs && StyledBreadCrumbs()}

          {children}
        </Grid>
      </Grid>

      <style jsx global>{`
        html {
          height: 100%;
          box-sizing: border-box;
          margin: 0; // will this fix the initial paint margin???
          padding: 0;
        }

        *,
        *:before,
        *:after {
          box-sizing: inherit;
        }

        a {
          color: #b7bec9;
        }

        * {
          color: white;
        }

        body {
          height: 100%;

          background-color: ${theme.palette.background.default};
          margin: 0;
          padding: 0;
          font-size: 16px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
        }

        input,
        textarea {
          font-size: 16px;
        }

        button {
          cursor: pointer;
          background-color: #353840;
        }
      `}</style>

      {/* <Footer /> */}
    </ThemeProvider>
  );
};

export default Layout;
