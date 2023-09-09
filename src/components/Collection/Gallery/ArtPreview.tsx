import { Grid, Typography, useMediaQuery } from "@mui/material";
import { styled } from "@mui/system";
import { Paper } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { showAllOption } from "../../../utils/helpers/getDefaultValues";

const StyledArtImageWrapper = styled("div")((props: { height: string }) => ({
  height: props.height,
  minHeight: props.height,
  width: "100%",
}));

const StyleArtImage = styled("img")({
  objectFit: "cover",
  height: "100%",
  width: "100%",
  borderRadius: 10,

  "&:hover": {
    transform: "scale(1.04)",
    transition: "transform .3s",
  },
});

const StyledArtPaper = styled(Paper)({
  backgroundColor: "transparent",
  borderRadius: 10,
  cursor: "pointer",
  transition: ".25s ease-out",
  "&:hover .info-text-wrapper": {
    transform: "scale(1.04)",
    transition: "transform .3s",
  },
});

const StyledInfoWrapper = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  position: "absolute",
  background: "rgba(27, 38, 49, 0.7)",
  backdropFilter: "blur(10px)",
  borderRadius: "12px",
  width: "fit-content",
  padding: "8px 12px",
  bottom: "5px",
  marginLeft: "5px",
  pointerEvents: "none",
});

const StyledTitle = styled("h4")({
  fontSize: 16,
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

const ArtPreview = ({ data, collectionId }) => {
  const router = useRouter();
  const { id, image, name, price, height, width, sizeUnit, userId, showPrice } =
    data;

  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:960px)");
  const isDesktop = useMediaQuery("(max-width:1550px)");

  const getImageHeight = () => {
    if (isMobile) {
      return "290px";
    }
    if (isTablet) {
      return "290px";
    }
    if (isDesktop) {
      return "380px";
    }
    return "480px";
  };

  const priceFormatted = new Intl.NumberFormat("en-CA").format(price);

  const showAllSelected = collectionId === showAllOption.id;

  const StyledArtCard = ({ ...props }) => (
    <div {...props} style={{ position: "relative" }}>
      <StyledArtImageWrapper height={getImageHeight()}>
        <StyleArtImage src={image} />
      </StyledArtImageWrapper>
      <StyledInfoWrapper className="info-text-wrapper">
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
    <Grid item xs={2} sm={4} md={4} lg={2} xl={2}>
      <StyledArtPaper>
        {!showAllSelected ? (
          <Link
            href={`/artist/${userId}/collection/${collectionId}?artId=${id}`}
            legacyBehavior
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
  );
};

export default ArtPreview;
