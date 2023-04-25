import { Grid } from "@mui/material";

interface GalleryGridProps {
  children: React.ReactNode;
  xl?: number;
}
const GalleryGrid = ({ children, xl }: GalleryGridProps) => {
  return (
    <Grid
      style={{
        padding: "42px 16px",
      }}
      container
      spacing={{ xs: 2, sm: 2, md: 3, lg: 3, xl: 3 }}
      columns={{ xs: 4, sm: 8, md: 8, lg: 6, xl: xl || 6 }}
    >
      {children}
    </Grid>
  );
};

export default GalleryGrid;
