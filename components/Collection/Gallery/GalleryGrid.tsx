import { Grid } from "@mui/material";

interface GalleryGridProps {
  children: React.ReactNode;
  xl?: number;
}
const GalleryGrid = ({ children, xl }: GalleryGridProps) => {
  return (
    <Grid
      style={{
        padding: "64px 24px",
      }}
      container
      spacing={{ xs: 1, sm: 2, md: 2, lg: 1.5, xl: 2 }}
      columns={{ xs: 4, sm: 8, md: 6, lg: 8, xl: xl || 10 }}
    >
      {children}
    </Grid>
  );
};

export default GalleryGrid;
