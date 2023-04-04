import { useRef, useState } from "react";
import { Button, Collapse, TextField, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/system";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Add, AddAPhoto } from "@mui/icons-material";
import Spacer from "../Spacer";
import GalleryGrid from "../Collection/Gallery/GalleryGrid";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { useSWRConfig } from "swr";

import {
  handleUploadCoverPicture,
  handleUploadProfilePicture,
} from "../../utils/helpers/handleUploadFile";
import CreateCollectionDialog from "../Modal/CreateCollectionDialog";
import { showAllOption } from "../../utils/helpers/getDefaultValues";
import { useArtistsPaintings } from "../../utils/hooks/useQueryData";
import EditCollectionDialog from "../Modal/EditCollectionDialog";
import ArtDialog from "../Collection/Gallery/Dialog/ArtDialog";
import ArtPreview from "../Collection/Gallery/ArtPreview";
import CollectionList from "../Collection/CollectionList";
import AddArtworkDialog from "../Modal/AddArtworkDialog";

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

  const { mutate: globalMutate } = useSWRConfig();

  const [bioOpen, setBioOpen] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(artist);
  const [selectedCollectionId, setSelectedCollectionId] = useState(
    // TODO: change to artist's default collection
    showAllOption.id
  );
  const showAllSelected = selectedCollectionId === showAllOption.id;

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const hiddenProfilePicFileRef = useRef(null);
  const hiddenCoverPicFileRef = useRef(null);
  const [uploadedProfilePic, setUploadedProfilePic] = useState(null);
  const [uploadedCoverPic, setUploadedCoverPic] = useState(null);

  const [createCollectionDialogOpen, setCreateCollectionDialogOpen] =
    useState(false);
  const [addArtworkDialogOpen, setAddArtworkDialogOpen] = useState(false);

  const { data: gallery, isLoading: isLoadingGallery } = useArtistsPaintings(
    artistId,
    selectedCollectionId
  );

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
        <StyledCoverWrapper>
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
            sx={{ width: 128, height: 128 }}
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
            </StyledEditProfileWrapper>
          ) : (
            <StyledProfileInfo>
              <>
                <h1>{updatedUser.name}</h1>
                <Collapse
                  collapsedSize={"34px"}
                  in={bioOpen}
                  style={{ transformOrigin: "0 0 0" }}
                  timeout={800}
                >
                  <Typography
                    variant="body1"
                    color={"#8a939b"}
                    sx={bioOpen ? { whiteSpace: "pre-line" } : null}
                  >
                    {updatedUser.bio}
                  </Typography>
                </Collapse>
                {(updatedUser.bio.length > 107 ||
                  updatedUser.bio.includes("\n")) && (
                  <div
                    style={{ cursor: "pointer", marginTop: 10 }}
                    onClick={() => setBioOpen(!bioOpen)}
                  >
                    {bioOpen ? "Show less" : "Show more"}
                    <Spacer y={4} />
                  </div>
                )}
              </>
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
      <div style={{ minHeight: "94vh" }}>
        <Spacer y={1} />

        <CollectionList
          selectedCollectionId={selectedCollectionId}
          setSelectedCollectionId={setSelectedCollectionId}
          openEditDialog={() => setEditDialogOpen(true)}
        />

        {!gallery?.length && !isLoadingGallery && (
          <Typography variant="h5" marginLeft={3}>
            This collection is empty
          </Typography>
        )}

        {!!(gallery?.length && !isLoadingGallery) && (
          <GalleryGrid>
            {gallery?.map((artwork) => (
              <ArtPreview
                key={artwork.id}
                data={artwork}
                collectionId={selectedCollectionId}
              />
            ))}
          </GalleryGrid>
        )}
      </div>

      {editDialogOpen && (
        <EditCollectionDialog
          selectedCollectionId={selectedCollectionId}
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
        />
      )}
      {showAllSelected && <ArtDialog />}
    </main>
  );
};

export default Artist;
