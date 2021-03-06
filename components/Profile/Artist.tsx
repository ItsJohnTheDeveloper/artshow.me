import { useEffect, useState } from "react";
import { Button, Collapse, TextField, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/system";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Add } from "@mui/icons-material";
import Spacer from "../Spacer";
import { useUser } from "../../contexts/user-context";
import CreateCollectionDialog from "../Modal/CreateCollectionDialog";
import { Artist } from "../../models/Artist";
import { Collection } from "../../models/Collection";
import CollectionList from "../Collection/CollectionList";
import ArtPreview from "../Collection/Gallery/ArtPreview";
import { showAllOption } from "../../utils/helpers/getDefaultValues";
import useCollections from "../../utils/hooks/useCollections";
import EditCollectionDialog from "../Modal/EditCollectionDialog";
import GalleryGrid from "../Collection/Gallery/GalleryGrid";

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
  collections: Collection[];
}

const Artist = ({ artist, collections }: ArtistProps) => {
  const [bioOpen, setBioOpen] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(artist);
  const [selectedCollection, setSelectedCollection] = useState(showAllOption);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [createCollectionDialogOpen, setCreateCollectionDialogOpen] =
    useState(false);

  const {
    collectionGallery,
    isLoading: isLoadingCollectionGallery,
    updateCollection,
    error,
  } = useCollections(selectedCollection, artist.id);

  useEffect(() => {
    // update the collection when the EditCollectionDialog closes
    updateCollection();
  }, [editDialogOpen]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { getUser: loggedInUser } = useUser();
  const isMyProfile = loggedInUser && loggedInUser.id === artist?.id;

  const onEditProfileSubmit = async (data) => {
    try {
      const res = await fetch(`/api/users/${artist.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      const resData = await res.json();
      setUpdatedUser({ ...artist, name: resData.name });
      setInEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const onOpenCollectionCreateModal = () => {
    setCreateCollectionDialogOpen(true);
  };

  const handleCreateCollectionSubmit = async (data) => {
    const newCollectionData = { ...data, userId: artist.id };
    try {
      const res = await axios.post("/collection/create", newCollectionData);
      setCreateCollectionDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  console.log({ selectedCollection });

  const showAllCollections =
    selectedCollection.id === showAllOption.id && !isLoadingCollectionGallery;

  const showSpecificCollection =
    selectedCollection.id !== showAllOption.id && !isLoadingCollectionGallery;

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
        <StyledAvatar
          alt="profilename"
          src={artist.profilePic}
          sx={{ width: 128, height: 128 }}
        />
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
                <TextField
                  fullWidth
                  label="Name"
                  variant="filled"
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
                  </div>
                )}
              </>
            </StyledProfileInfo>
          )}
          {isMyProfile && (
            <>
              <Spacer y={4} />
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={onOpenCollectionCreateModal}
              >
                New Collection
              </Button>
              <CreateCollectionDialog
                open={createCollectionDialogOpen}
                setOpen={setCreateCollectionDialogOpen}
                handleOnSubmit={handleCreateCollectionSubmit}
              />
            </>
          )}
        </StyledProfileWrapper>
      </div>
      <CollectionList
        artist={artist}
        collections={collections}
        selectedCollection={selectedCollection}
        setSelectedCollection={setSelectedCollection}
        openEditDialog={() => setEditDialogOpen(true)}
      />

      {showAllCollections &&
        collectionGallery?.map(
          (collection) =>
            collection && (
              <>
                <Typography variant="h4" marginLeft={3}>
                  {collection.collectionName}
                </Typography>

                <GalleryGrid>
                  {collection?.paintings?.map((artwork, index) => (
                    <ArtPreview
                      data={artwork}
                      key={artwork.id}
                      collectionName={collection.collectionName}
                    />
                  ))}
                </GalleryGrid>
              </>
            )
        )}

      {showSpecificCollection && (
        <GalleryGrid>
          {collectionGallery?.map((painting) => (
            <ArtPreview
              data={painting}
              key={painting.id}
              collectionName={selectedCollection.name}
            />
          ))}
        </GalleryGrid>
      )}
      <Spacer y={isLoadingCollectionGallery ? 80 : 50} />

      <EditCollectionDialog
        selectedCollection={selectedCollection}
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
      />
    </div>
  );
};

export default Artist;
