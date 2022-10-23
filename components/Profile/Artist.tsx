import { useEffect, useRef, useState } from "react";
import { Button, Collapse, TextField, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/system";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Add, AddAPhoto } from "@mui/icons-material";
import Spacer from "../Spacer";
import { useUser } from "../../contexts/user-context";
import CreateCollectionDialog from "../Modal/CreateCollectionDialog";
import { Artist } from "../../models/Artist";
import CollectionList from "../Collection/CollectionList";
import ArtPreview from "../Collection/Gallery/ArtPreview";
import { showAllOption } from "../../utils/helpers/getDefaultValues";
import { useCollection } from "../../utils/hooks/useQueryData";
import EditCollectionDialog from "../Modal/EditCollectionDialog";
import GalleryGrid from "../Collection/Gallery/GalleryGrid";
import { handleUploadProfilePicture } from "../../utils/helpers/handleUploadFile";
import AddArtworkDialog from "../Modal/AddArtworkDialog";
import ArtDialog from "../Collection/Gallery/Dialog/ArtDialog";
import { useRouter } from "next/router";

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

interface ArtistProps {
  artist: Artist;
}

const Artist = ({ artist }: ArtistProps) => {
  const router = useRouter();
  const artistId = router.query?.artist_id;

  const [bioOpen, setBioOpen] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(artist);
  const [selectedCollection, setSelectedCollection] = useState(showAllOption);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const hiddenFileInputRef = useRef(null);
  const [uploadedProfilePic, setUploadedProfilePic] = useState(null);

  const [createCollectionDialogOpen, setCreateCollectionDialogOpen] =
    useState(false);
  const [addArtworkDialogOpen, setAddArtworkDialogOpen] = useState(false);

  const { data: gallery, isLoading: isLoadingGallery } = useCollection({
    userId: artistId,
    id: selectedCollection?.id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { getUser: loggedInUser } = useUser();
  const isMyProfile = loggedInUser && loggedInUser.id === artist?.id;

  const onEditProfileSubmit = async (formData) => {
    if (uploadedProfilePic) {
      formData.profilePic = uploadedProfilePic;
    }
    try {
      const { data } = await axios.patch(`/users/${artist.id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser?.accessToken}`,
        },
      });
      setUpdatedUser({ ...artist, name: data.name });
      setInEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const onOpenCollectionCreateModal = () => {
    setCreateCollectionDialogOpen(true);
  };

  const onOpenAddArtworkModal = () => {
    setAddArtworkDialogOpen(true);
  };

  const handleCreateCollectionSubmit = async (data) => {
    const newCollectionData = { ...data, userId: artist.id };
    try {
      await axios.post("/collection/create", newCollectionData, {
        headers: { Authorization: `Bearer ${loggedInUser?.accessToken}` },
      });
      setCreateCollectionDialogOpen(false);
    } catch (err) {
      // TODO: handle error later
      console.error(err);
    }
  };

  const showAllSelected = selectedCollection.id === showAllOption.id;

  return (
    <div>
      <div
        style={{
          backgroundColor: inEditMode ? "unset" : "unset",
          border: inEditMode ? "2px dotted white" : "unset",
          paddingBottom: inEditMode ? 16 : "unset",
        }}
      >
        <StyledCoverWrapper>
          <StyledCoverImage src={artist.coverPic} />
        </StyledCoverWrapper>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <StyledAvatar
            alt="profilename"
            src={uploadedProfilePic || artist.profilePic}
            sx={{ width: 128, height: 128 }}
          />
          {inEditMode && (
            <>
              <AddAPhoto
                style={{
                  position: "relative",
                  bottom: 27,
                  right: -43,
                  marginBottom: -10,
                  cursor: "pointer",
                }}
                onClick={() => {
                  hiddenFileInputRef.current.click();
                }}
              />
              <input
                type={"file"}
                ref={hiddenFileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  handleUploadProfilePicture(
                    file,
                    loggedInUser.id,
                    (url: string) => {
                      setUploadedProfilePic(url);
                    }
                  );
                }}
              />
            </>
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
                  defaultValue={artist.name}
                  {...register("name", { required: true })}
                />
                <Spacer y={2} />
                <TextField
                  fullWidth
                  multiline
                  maxRows={7}
                  label="Bio"
                  variant="outlined"
                  defaultValue={artist.bio}
                  {...register("bio")}
                />
              </form>
            </StyledEditProfileWrapper>
          ) : (
            <StyledProfileInfo>
              <>
                <h1>{updatedUser.name}</h1>
                <Collapse
                  collapsedSize={artist.bio.length > 250 ? 53 : null}
                  in={bioOpen}
                  style={{ transformOrigin: "0 0 0" }}
                  timeout={800}
                >
                  <div style={{ color: "#8a939b" }}>{artist.bio}</div>
                </Collapse>
                {artist.bio.length > 250 && (
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
                  <div style={{ display: "flex", justifyContent: "center" }}>
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
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
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
                collection={selectedCollection}
              />
            ))}
          </GalleryGrid>
        )}
      </div>

      <EditCollectionDialog
        selectedCollection={selectedCollection}
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
      />
      {showAllSelected && <ArtDialog />}
    </div>
  );
};

export default Artist;
