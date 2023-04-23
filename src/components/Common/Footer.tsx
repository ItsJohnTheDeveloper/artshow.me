import React from "react";
import { styled } from "@mui/system";
import { Grid, Typography } from "@mui/material";

const StyledFooter = styled("footer")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#193264",
  height: 350,
});

const StyledNav = styled(Grid)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& > *": {
    marginLeft: 20,
  },
});

const Footer = () => {
  return (
    <StyledFooter>
      <Grid container alignItems="center">
        <Grid item xs={6} textAlign={"center"}>
          <a className="bold" style={{ alignSelf: "center" }}>
            <img src="/artcade-io-logo.png" style={{ height: 48 }} />
          </a>
        </Grid>
        <Grid item xs={6} justifySelf={"center"}>
          <StyledNav container>
            <Typography variant="body1" color="textSecondary">
              Nav link 1
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Nav link 2
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Nav link 3
            </Typography>
          </StyledNav>
        </Grid>
      </Grid>
    </StyledFooter>
  );
};

export default Footer;
