import { Add } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useUser } from "../../contexts/user-context";
import useCollections from "../../utils/hooks/useCollections";
import { getRandomImage } from "../../utils/helpers/getRandomImage";
import Spacer from "../Spacer";

const EditCollectionDialog = ({ selectedCollection, open, setOpen }) => {
  const router = useRouter();
  const artistId = router.query.artist_id;

  const { getUser: loggedInUser } = useUser();

  const {
    collectionGallery,
    isLoading: isLoadingPaintings,
    error,
  } = useCollections(selectedCollection, artistId);

  const [paintings, setPaintings] = useState([]);

  const [editMode, setEditMode] = useState("");
  const [addingNewPainting, setAddingNewPainting] = useState(false);
  const [newPainting, setNewPainting] = useState(null);

  useEffect(() => {
    if (!isLoadingPaintings && !error) {
      setPaintings(collectionGallery);
    }
  }, [collectionGallery, isLoadingPaintings]);

  const handleOnNewPaintingCreate = async () => {
    const fullPaintingObject = {
      ...newPainting,
      width: 123,
      height: 123,
      collectionId: selectedCollection.id,
      userId: loggedInUser.id,
    };

    try {
      const response = await axios.post("/painting/create", fullPaintingObject);

      // once the painting is created, add it to the collection
      setPaintings([...paintings, response.data]);
    } catch (err) {
      console.error(err);
    }

    //  reset the creating painting state
    setAddingNewPainting(false);
    setNewPainting({});
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items: any = reorder(
      paintings,
      result.source.index,
      result.destination.index
    );

    setPaintings(items);
  };

  return (
    <Dialog
      fullWidth
      PaperProps={{
        style: {
          maxHeight: "100vh",
          margin: 0,
          backgroundColor: "#212730",
          boxShadow: "24px",
          borderRadius: 12,
          backgroundImage: "unset",
        },
      }}
      maxWidth={"md"}
      open={open}
    >
      <DialogTitle>{`Edit ${selectedCollection?.name}`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Here you can add, edit, remove, or change the order of your painting
          by dragging and dropping them.
        </DialogContentText>
        {isLoadingPaintings && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress color="success" />
          </div>
        )}
        <List component="div">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {paintings?.map((painting, index) => {
                    const isEditing = painting.id === editMode;

                    if (isEditing) {
                      return (
                        <ListItem>
                          <img src={painting.image} height={128} width={128} />
                          <Spacer x={2} />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <TextField
                              id="outlined-title"
                              label="Title"
                              value={painting.title}
                              onChange={() => {}}
                            />
                            <Spacer y={1} />
                            <TextField
                              id="outlined-description"
                              label="Description"
                              value={painting.description}
                              onChange={() => {}}
                            />
                          </div>
                          <div style={{ right: 0, position: "absolute" }}>
                            <Button onClick={() => setEditMode(painting.id)}>
                              save
                            </Button>
                            <Button onClick={() => setEditMode("")}>
                              cancel
                            </Button>
                          </div>
                        </ListItem>
                      );
                    }
                    return (
                      <Draggable
                        key={painting.id}
                        draggableId={painting.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <img
                              src={painting.image}
                              height={128}
                              width={128}
                            />
                            <Spacer x={2} />
                            <ListItemText
                              primary={painting.title}
                              secondary={painting.description}
                            />
                            <Button onClick={() => setEditMode(painting.id)}>
                              edit
                            </Button>
                          </ListItem>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {addingNewPainting ? (
            <ListItem>
              {newPainting?.image ? (
                <img src={newPainting?.image} height={128} width={128} />
              ) : (
                <Button
                  onClick={() =>
                    setNewPainting({
                      ...newPainting,
                      image: getRandomImage(),
                    })
                  }
                >
                  Add image
                </Button>
              )}

              <Spacer x={2} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <TextField
                  id="outlined-name"
                  label="Name"
                  value={newPainting?.name}
                  onChange={(e) =>
                    setNewPainting({ ...newPainting, name: e.target.value })
                  }
                />
                <Spacer y={1} />
                <TextField
                  id="outlined-description"
                  label="Description"
                  value={newPainting?.description}
                  onChange={(e) =>
                    setNewPainting({
                      ...newPainting,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ right: 0, position: "absolute" }}>
                <Button onClick={handleOnNewPaintingCreate}>save</Button>
                <Button
                  onClick={() => {
                    setEditMode("");
                    setNewPainting({});
                    setAddingNewPainting(false);
                  }}
                >
                  cancel
                </Button>
              </div>
            </ListItem>
          ) : (
            <ListItemButton onClick={() => setAddingNewPainting(true)}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Add new" />
            </ListItemButton>
          )}
        </List>
      </DialogContent>
      <DialogActions style={{ borderTop: "1px solid #14171c" }}>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={() => {}}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCollectionDialog;
