import { useState } from "react";
import {
  Button,
  Chip,
  Collapse,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/system";
import { useUser } from "../../contexts/user-context";
import Spacer from "../Spacer";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Add } from "@mui/icons-material";
import CreateCollectionDialog from "../Modal/CreateCollectionDialog";
import { Artist } from "../../models/Artist";
import { Collection } from "../../models/Collection";

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState("Show all");

  const [createCollectionDialogOpen, setCreateCollectionDialogOpen] =
    useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  console.log(collections);
  const { getUser: loggedInUser } = useUser();
  const isMyProfile = loggedInUser && loggedInUser.id === artist?.id;

  const onEditProfileSubmit = async (data) => {
    console.log(data);
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
    console.log(data);

    const newCollectionData = { ...data, userId: artist.id };
    try {
      const res = await axios.post("/collection/create", newCollectionData);
      setCreateCollectionDialogOpen(false);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChipOnClick = (e, open, setOpen) => {
    if (isMyProfile) {
      setAnchorEl(e.currentTarget);
      setOpen(!open);
      return;
    }
    setSelectedCollection(e.currentTarget.innerText);
  };

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

      <div
        style={{
          display: "flex",
          overflow: "auto",
          gap: 6,
          margin: "24px 0px 24px 24px",
          paddingBottom: 12,
        }}
      >
        <Chip
          label={"Show all"}
          variant={selectedCollection === "Show all" ? "filled" : "outlined"}
          onClick={(e) => setSelectedCollection(e.currentTarget.innerText)}
          style={{ height: 46, marginRight: 6 }}
        />
        {collections.map((collection, i) => {
          const [open, setOpen] = useState(false);

          return (
            <>
              <Chip
                key={i}
                label={collection.name}
                variant={
                  selectedCollection === collection.name ? "filled" : "outlined"
                }
                onClick={(e) => handleChipOnClick(e, open, setOpen)}
                style={{ height: 46 }}
              />
              {isMyProfile && (
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => setOpen(false)}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setOpen(false);
                      setSelectedCollection(collection.name);
                    }}
                  >
                    View
                  </MenuItem>
                  <MenuItem onClick={() => setOpen(false)}>Edit</MenuItem>
                </Menu>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Artist;
