import { useRef, useState } from "react";
import {
  Button,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Box, styled } from "@mui/system";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Add, AddAPhoto } from "@mui/icons-material";
import Spacer from "../Common/Spacer";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { useSWRConfig } from "swr";

import {
  handleUploadCoverPicture,
  handleUploadProfilePicture,
  handleUploadBioPicture,
} from "../../utils/helpers/handleUploadFile";
import CreateCollectionDialog from "../Modal/CreateCollectionDialog";
import AddArtworkDialog from "../Modal/AddArtworkDialog";
import Gallery from "./Content/Gallery";
import theme from "../../styles/theme";
import Biography from "./Content/Biography";

const StyledCoverWrapper = styled("div")((props: { isMobile: boolean }) => ({
  height: props.isMobile ? 128 : 220,
  width: "100%",
}));

const StyledCoverImage = styled("img")({
  objectFit: "cover",
  height: "100%",
  width: "100%",
});

const StyledAvatar = styled(Avatar)({
  border: "2px solid grey",
  margin: "auto",
  top: -75,
  marginBottom: -64,
});

const StyledProfileWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});

const StyledEditProfileWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  maxWidth: 655,
  width: "100%",
  marginBotton: 12,
  textAlign: "center",
});

const StyledProfileInfo = styled("div")({
  maxWidth: 760,
  textAlign: "center",
});

const FileImageInputComponent = ({ onChange, reference, styles }) => (
  <>
    <AddAPhoto
      style={styles}
      onClick={() => {
        reference.current.click();
      }}
    />
    <input
      type={"file"}
      ref={reference}
      style={{ display: "none" }}
      onChange={onChange}
    />
  </>
);

const Artist = ({ artist }: { artist: User }) => {
  const router = useRouter();
  const artistId = router.query?.artist_id as string;

  const isMobile = useMediaQuery("(max-width:600px)");

  const { mutate: globalMutate } = useSWRConfig();

  const [inEditMode, setInEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(artist);

  const hiddenProfilePicFileRef = useRef(null);
  const hiddenCoverPicFileRef = useRef(null);
  const hiddenBioPicFileRef = useRef(null);

  const [uploadedProfilePic, setUploadedProfilePic] = useState(null);
  const [uploadedCoverPic, setUploadedCoverPic] = useState(null);
  const [uploadedBioPic, setUploadedBioPic] = useState(null);

  const [createCollectionDialogOpen, setCreateCollectionDialogOpen] =
    useState(false);
  const [addArtworkDialogOpen, setAddArtworkDialogOpen] = useState(false);

  const [tabSelected, setTabSelected] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { data: session } = useSession();

  const isMyProfile = session?.user && session?.user?.id === artistId;

  const onEditProfileSubmit = async (formData) => {
    if (!session) return;

    if (uploadedProfilePic) {
      formData.profilePic = uploadedProfilePic;
    }
    if (uploadedCoverPic) {
      formData.coverPic = uploadedCoverPic;
    }
    if (uploadedBioPic) {
      formData.bioPic = uploadedBioPic;
    }
    try {
      const { data } = await axios.patch(`/users/${artist.id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      globalMutate(`/users/${artist.id}`, data);
      setUpdatedUser(data);
      setInEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const onOpenCollectionCreateModal = () => {
    setCreateCollectionDialogOpen(true);
  };

  const onOpenAddArtworkModal = () => {
    if (isMyProfile) {
      setAddArtworkDialogOpen(true);
    }
  };

  const handleCreateCollectionSubmit = async (data) => {
    if (!session) return;

    const newCollectionData = { name: data?.name, userId: artist.id };
    try {
      await axios.post("/collections/create", newCollectionData);

      globalMutate(`/collections/user/${artist.id}`);
      setCreateCollectionDialogOpen(false);
    } catch (err) {
      // TODO: handle error later
      console.error(err);
    }
  };

  return (
    <main>
      <div
        style={{
          backgroundColor: inEditMode ? "unset" : "unset",
          border: inEditMode ? "2px dotted white" : "unset",
          paddingBottom: inEditMode ? 16 : "unset",
        }}
      >
        <StyledCoverWrapper isMobile={isMobile}>
          {/* TODO: add a default image here if they don't have one. */}
          <StyledCoverImage src={uploadedCoverPic ?? artist?.coverPic} />
        </StyledCoverWrapper>
        {inEditMode && (
          <FileImageInputComponent
            onChange={(e) => {
              const file = e.target.files?.[0];
              try {
                handleUploadCoverPicture(file, session.user, (url: string) => {
                  setUploadedCoverPic(url);
                });
              } catch (err) {}
            }}
            reference={hiddenCoverPicFileRef}
            styles={{
              position: "relative",
              float: "right",
              bottom: 26,
              right: 4,
              cursor: "pointer",
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <StyledAvatar
            imgProps={{ referrerPolicy: "no-referrer" }}
            alt="profilename"
            src={uploadedProfilePic ?? artist?.profilePic ?? artist?.image} // order of precedence is uploaded image (edit), profile pic, google image
            sx={{ width: 150, height: 150 }}
          />
          {inEditMode && (
            <FileImageInputComponent
              onChange={(e) => {
                const file = e.target.files?.[0];
                try {
                  handleUploadProfilePicture(
                    file,
                    session.user,
                    (url: string) => {
                      setUploadedProfilePic(url);
                    }
                  );
                } catch (err) {}
              }}
              reference={hiddenProfilePicFileRef}
              styles={{
                position: "relative",
                bottom: 27,
                right: -43,
                marginBottom: -10,
                cursor: "pointer",
              }}
            />
          )}
        </div>
        <StyledProfileWrapper>
          {isMyProfile && !inEditMode && (
            <div style={{ display: "flex" }}>
              <Button
                variant="text"
                type={"submit"}
                onClick={() => setInEditMode(true)}
              >
                {"edit profile"}
              </Button>
            </div>
          )}

          {inEditMode ? (
            <StyledEditProfileWrapper>
              <form onSubmit={handleSubmit(onEditProfileSubmit)}>
                <>
                  <Button variant="text" type={"submit"}>
                    {"save"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setInEditMode(false)}
                  >
                    {"cancel"}
                  </Button>
                </>
                <Spacer y={1} />
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  defaultValue={updatedUser.name}
                  {...register("name", { required: true })}
                />
                <Spacer y={2} />
                <TextField
                  fullWidth
                  multiline
                  maxRows={7}
                  label="Bio"
                  variant="outlined"
                  defaultValue={updatedUser.bio}
                  {...register("bio")}
                />
              </form>
              <Spacer y={2} />
              <Typography component="h5" textAlign={"left"}>
                Biography Photo
              </Typography>
              <Spacer y={1} />
              <Avatar
                imgProps={{ referrerPolicy: "no-referrer" }}
                alt="biography picture"
                src={uploadedBioPic ?? artist?.bioPic} // order of precedence is uploaded image (edit), profile pic, google image
                sx={{ width: 75, height: 75 }}
              />
              <FileImageInputComponent
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  try {
                    handleUploadBioPicture(
                      file,
                      session.user,
                      (url: string) => {
                        setUploadedBioPic(url);
                      }
                    );
                  } catch (err) {}
                }}
                reference={hiddenBioPicFileRef}
                styles={{
                  position: "relative",
                  bottom: 18,
                  right: -52,
                  marginBottom: -14,
                  cursor: "pointer",
                }}
              />
            </StyledEditProfileWrapper>
          ) : (
            <StyledProfileInfo>
              <Typography component="h1" sx={{ fontSize: 30, padding: "12px" }}>
                {updatedUser.name}
              </Typography>
              {isMyProfile && (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: 14,
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={onOpenAddArtworkModal}
                    >
                      Add Artwork
                    </Button>
                    <Spacer x={2} />
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={onOpenCollectionCreateModal}
                    >
                      New Collection
                    </Button>
                  </div>
                  <AddArtworkDialog
                    open={addArtworkDialogOpen}
                    setOpen={setAddArtworkDialogOpen}
                  />
                  <CreateCollectionDialog
                    open={createCollectionDialogOpen}
                    setOpen={setCreateCollectionDialogOpen}
                    handleOnSubmit={handleCreateCollectionSubmit}
                  />
                </>
              )}
            </StyledProfileInfo>
          )}
        </StyledProfileWrapper>
      </div>

      <Box
        sx={{
          padding: "0px 24px",
          borderBottom: `1px solid ${theme.palette.background.border}`,
        }}
      >
        <Tabs value={tabSelected} onChange={(_, tab) => setTabSelected(tab)}>
          <Tab label="gallery" />
          <Tab label="biography" />
        </Tabs>
      </Box>
      {tabSelected === 0 && <Gallery />}
      {tabSelected === 1 && <Biography />}
    </main>
  );
};

export default Artist;
