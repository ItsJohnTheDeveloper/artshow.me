import {
  Avatar,
  Button,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useFeatArtists } from "../../utils/hooks/useQueryData";
import Layout from "../Common/Layout";
import Spacer from "../Common/Spacer";
import styled from "@emotion/styled";
import Link from "next/link";
import { User } from "@prisma/client";

const AvatarBackground = styled.div`
  padding: 2px;
  position: relative;
  background: radial-gradient(
        circle at 100% 100%,
        #ffffff00 0,
        #ffffff00 21px,
        transparent 21px
      )
      0% 0%/30px 30px no-repeat,
    radial-gradient(
        circle at 0 100%,
        #ffffff00 0,
        #ffffff00 21px,
        transparent 21px
      )
      100% 0%/30px 30px no-repeat,
    radial-gradient(
        circle at 100% 0,
        #ffffff00 0,
        #ffffff00 21px,
        transparent 21px
      )
      0% 100%/30px 30px no-repeat,
    radial-gradient(
        circle at 0 0,
        #ffffff00 0,
        #ffffff00 21px,
        transparent 21px
      )
      100% 100%/30px 30px no-repeat,
    linear-gradient(#ffffff00, #ffffff00) 50% 50% / calc(100% - 18px)
      calc(100% - 60px) no-repeat,
    linear-gradient(#ffffff00, #ffffff00) 50% 50% / calc(100% - 60px)
      calc(100% - 18px) no-repeat,
    linear-gradient(
      135deg,
      #00ffd5 0%,
      #00e0ff 16%,
      #00d1ff 31%,
      #4200ff 48%,
      #5200ff 53%,
      #ff007a 99%
    );

  border-radius: 50%;

  &:hover {
    transform: scale(1.06);
    transition: transform 0.3s;
  }
`;

const index = () => {
  const { data } = useFeatArtists();
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Layout>
      <main>
        <div style={{ backgroundColor: "#18212b" }}>
          <Stack
            justifyContent={"center"}
            direction={{
              xs: "column-reverse",
              sm: "column-reverse",
              md: "row",
              lg: "row",
              xl: "row",
            }}
          >
            <Grid item justifyContent={"center"} padding={8}>
              <Typography variant="h4" component="h1">
                Lorem ipsum dolor sit amet, consectetur
              </Typography>
              <Typography variant="h5" component="h2" color={"#C1C1C1"}>
                ut labore et dolore magna aliqua. Ut enim ad minim veniam
              </Typography>
              <Button variant="contained">Join</Button>
            </Grid>
            <Grid item>
              <div style={{ maxHeight: 379 }}>
                <img
                  src="/gallery/landing.jpg"
                  style={{
                    height: "100%",
                    width: "100%",
                    maxHeight: 379,
                    objectFit: "cover",
                  }}
                />
              </div>
            </Grid>
          </Stack>
        </div>
        <div style={{ padding: isMobile ? "6px" : "48px" }}>
          <Typography variant="h4" component="h1">
            Featured Artists
          </Typography>
          <Spacer y={4} />
          <Stack
            direction="row"
            spacing={4}
            flexWrap="wrap"
            justifyContent={isMobile ? "center" : "inherit"}
          >
            {data?.map((artist: User) => (
              <Link href={`/artist/${artist.id}`}>
                <div key={artist.id}>
                  <AvatarBackground>
                    <Avatar
                      style={{
                        border: "3px solid black",
                        borderRadius: "50%",
                        pointerEvents: "none",
                      }}
                      imgProps={{ referrerPolicy: "no-referrer" }}
                      alt="profilename"
                      src={artist.profilePic} // order of precedence is uploaded image (edit), profile pic, google image
                      sx={{ width: 150, height: 150 }}
                    />
                  </AvatarBackground>
                  <Typography textAlign={"center"} color={"#F3F3F3"}>
                    {artist.name}
                  </Typography>
                </div>
              </Link>
            ))}
          </Stack>
        </div>
      </main>
    </Layout>
  );
};
export default index;
