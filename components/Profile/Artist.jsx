import { useState } from "react";
import { Collapse, Grow } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/system";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const StyledCoverWrapper = styled("div")({
  height: 220,
  width: "100%",
});

const StyledCoverImage = styled("img")({
  objectFit: "cover",
  height: "100%",
  width: "100%",
});

const StyledAvatar = styled(Avatar)({
  border: "2px solid grey",
  margin: "auto",
  top: -64,
  marginBottom: -64,
});

const StyledProfileWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});

const StyledProfileInfo = styled("div")({
  maxWidth: 760,
  textAlign: "center",
});

const Artist = ({ data }) => {
  const [bioOpen, setBioOpen] = useState(false);
  return (
    <div>
      <StyledCoverWrapper>
        <StyledCoverImage src={data.coverPhoto} />
      </StyledCoverWrapper>
      <StyledAvatar
        alt="profilename"
        src={data.mainPhoto}
        sx={{ width: 128, height: 128 }}
      />
      <StyledProfileWrapper>
        <StyledProfileInfo>
          <h1>{data.name}</h1>
          {!bioOpen && (
            <div style={{ color: "#8a939b" }}>
              {data.bio.substring(0, 250)}...
            </div>
          )}
          <Collapse
            in={bioOpen}
            style={{ transformOrigin: "0 0 0" }}
            timeout={800}
          >
            <div style={{ color: "#8a939b" }}>{data.bio}</div>
          </Collapse>
          {data.bio.length > 250 &&
            (bioOpen ? (
              <ExpandLess
                style={{ cursor: "pointer" }}
                onClick={() => setBioOpen(false)}
              />
            ) : (
              <ExpandMore
                style={{ cursor: "pointer" }}
                onClick={() => setBioOpen(true)}
              />
            ))}
        </StyledProfileInfo>
      </StyledProfileWrapper>
    </div>
  );
};

export default Artist;
