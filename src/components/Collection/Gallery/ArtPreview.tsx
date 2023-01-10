import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Paper } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { showAllOption } from "../../../utils/helpers/getDefaultValues";
import theme from "../../../styles/theme";

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
  backgroundColor: theme.palette.background.paper,
  paddingBottom: 12,
  marginBottom: 10,
  borderRadius: 10,
  cursor: "pointer",
  transition: ".25s ease-out",

  ":hover": {
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

const ArtPreview = ({ data, collection }) => {
  const router = useRouter();
  const { id, image, name, price, height, width, sizeUnit, userId, showPrice } =
    data;

  const priceFormatted = new Intl.NumberFormat("en-CA").format(price);

  const showAllSelected = collection?.name === showAllOption.name;

  const StyledArtCard = ({ ...props }) => (
    <div {...props}>
      <StyledArtImageWrapper>
        <StyleArtImage src={image} />
      </StyledArtImageWrapper>
      <StyledInfoWrapper>
        <StyledColumnRight>
          <StyledTitle>{name}</StyledTitle>
          {sizeUnit && (
            <Typography sx={{ color: "#d5d5d5" }} variant="subtitle2">
              Size: {`${height} x ${width} ${sizeUnit}`}
            </Typography>
          )}
        </StyledColumnRight>
        {showPrice && (
          <StyledColumnLeft>
            <span style={{ color: "grey", fontSize: 12 }}>Price</span>
            <span style={{ fontSize: 14, fontWeight: "bold" }}>
              {price ? `${priceFormatted}` : "na"}
            </span>
          </StyledColumnLeft>
        )}
      </StyledInfoWrapper>
    </div>
  );

  const handleOnClickDialog = () => {
    router.query.artId = id;
    router.push(router, undefined, { scroll: false });
  };

  return (
    <>
      <Grid item xs={4} sm={4} md={2} lg={2} xl={2}>
        <StyledArtPaper>
          {!showAllSelected ? (
            <Link
              href={`/artist/${userId}/collection/${collection.name}?artId=${id}`}
            >
              <a style={{ textDecoration: "auto" }}>
                <StyledArtCard />
              </a>
            </Link>
          ) : (
            <StyledArtCard onClick={handleOnClickDialog} />
          )}
        </StyledArtPaper>
      </Grid>
    </>
  );
};

export default ArtPreview;
