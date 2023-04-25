import { useRouter } from "next/router";
import { Grid, Typography } from "@mui/material";
import { useArtist } from "../../../utils/hooks/useQueryData";
import Image from "next/image";

const Biography = () => {
  const router = useRouter();
  const artistId = router.query?.artist_id as string;
  const { data: artist } = useArtist(artistId);

  return (
    <Grid container spacing={4} justifyContent="center" p={3}>
      <Grid item xs={12} sm={12} md={8} lg={6} xl={5}>
        <Typography
          variant="body1"
          color={"#8a939b"}
          sx={{ whiteSpace: "pre-line" }}
        >
          {artist.bio}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
        <div
          style={{
            position: "sticky",
            top: 96,
            maxWidth: 400,
            maxHeight: 700,
            margin: "auto",
          }}
        >
          <img
            alt="biography image"
            src={artist?.bioPic ?? artist?.profilePic ?? ""}
            style={{
              objectFit: "cover",
              width: "100%",
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default Biography;
