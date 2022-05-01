import { Grid } from "@mui/material";
import { styled } from "@mui/system";
import { Paper } from "@mui/material";

const StyledArtImageWrapper = styled("div")({
  height: 290,
  minHeight: 290,
  width: "100%",
});

const StyleArtImage = styled("img")({
  objectFit: "cover",
  height: "100%",
  width: "100%",
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
});

const StyledArtPaper = styled(Paper)({
  backgroundColor: "#303339",
  paddingBottom: 12,
  marginBottom: 10,
  borderRadius: 10,
  cursor: "pointer",
  transition: ".25s ease-out",

  ":hover": {
    // paddingBottom: 12,
    // backgroundColor: "blue",
    boxShadow: "0px 3px #3b4048",
  },
});

const StyledInfoWrapper = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 12px 0px",
});

const StyledTitle = styled("h4")({
  fontSize: 15,
  margin: 0,
  fontWeight: "normal",
  // alignSelf: "center",
});

const StyledColumnRight = styled("div")({
  display: "flex",
  flexDirection: "column",
});
const StyledColumnLeft = styled("div")({
  display: "flex",
  flexDirection: "column",
  textAlign: "right",
  paddingLeft: 2,
});

const Art = ({ data }) => {
  const { category, description, id, images, title, price, size } = data;
  const thumbnail = images[0];
  const priceFormatted = new Intl.NumberFormat("en-CA").format(price);

  return (
    <Grid item xs={4} sm={4} md={2} lg={2} xl={2}>
      <StyledArtPaper>
        <StyledArtImageWrapper>
          <StyleArtImage src={thumbnail} />
        </StyledArtImageWrapper>
        <StyledInfoWrapper>
          <StyledColumnRight>
            <StyledTitle>{title}</StyledTitle>
            <span style={{ color: "#999999", fontSize: 10, paddingTop: 3 }}>
              Size: {size}
            </span>
          </StyledColumnRight>
          <StyledColumnLeft>
            <span style={{ color: "grey", fontSize: 12 }}>Price</span>
            <span style={{ fontSize: 14, fontWeight: "bold" }}>
              ${priceFormatted}
            </span>
          </StyledColumnLeft>
        </StyledInfoWrapper>
      </StyledArtPaper>
    </Grid>
  );
};

export default Art;
