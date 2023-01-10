import { useRef, useState } from "react";
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
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useUser } from "../../contexts/user-context";
import Spacer from "../Spacer";
import { handleUploadPaintingPicture } from "../../utils/helpers/handleUploadFile";
import { useCollection } from "../../utils/hooks/useQueryData";
import theme from "../../styles/theme";

const quickSortCollection = (collection: any[], sortBy: any[]) => {
  return (collection || []).sort(
    (a, b) => sortBy.indexOf(a.id) - sortBy.indexOf(b.id)
  );
};

const EditCollectionDialog = ({ selectedCollection, open, setOpen }) => {
  const router = useRouter();
  const artistId = router.query.artist_id;

  const { getUser: loggedInUser } = useUser();

  const {
    data: collection,
    isLoading: isLoadingCollection,
    mutate,
  } = useCollection({
    userId: artistId,
    id: selectedCollection?.id,
  });

  const hiddenFileInputRef = useRef(null);
  const [editMode, setEditMode] = useState("");
  const [addingNewPainting, setAddingNewPainting] = useState(false);
  const [newPainting, setNewPainting] = useState(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [editedCollectionOrder, setEditedCollectionOrder] = useState([]);

  const handleOnNewPaintingCreate = async () => {
    const fullPaintingObject = {
      ...newPainting,
      width: 123,
      height: 123,
      collectionIds: [selectedCollection.id],
      userId: loggedInUser.id,
    };

    try {
      const { data } = await axios.post(
        "/painting/create",
        fullPaintingObject,
        {
          headers: { Authorization: `Bearer ${loggedInUser?.accessToken}` },
        }
      );
      // revalidate cache with newly created painting
      mutate([...collection, data]);
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
      collection,
      result.source.index,
      result.destination.index
    );
    const itemIds = items.map((item) => item.id);
    setEditedCollectionOrder(itemIds);
  };

  const handleOnCollectionSave = async () => {
    try {
      await axios.patch(
        "/collection/updateCollectionOrder",
        {
          id: selectedCollection.id,
          order: editedCollectionOrder,
        },
        { headers: { Authorization: `Bearer ${loggedInUser?.accessToken}` } }
      );
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOnCollectionDelete = async () => {
    try {
      await axios.delete("/collection/delete", {
        data: { id: selectedCollection.id },
        headers: { Authorization: `Bearer ${loggedInUser?.accessToken}` },
      });
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog
      fullWidth
      PaperProps={{
        style: {
          maxHeight: "100vh",
          margin: 0,
          backgroundColor: theme.palette.background.default,
          boxShadow: "24px",
          borderRadius: 12,
          backgroundImage: "unset",
        },
      }}
      maxWidth={"md"}
      open={open}
    >
      {isLoadingCollection ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress color="success" />
        </div>
      ) : (
        <>
          <DialogTitle>
            <Typography variant="body1">
              Edit
              <Typography variant="h4" fontStyle={"italic"}>
                {selectedCollection?.name}
              </Typography>
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Here you can add, edit, remove, or change the order of your
              painting by dragging and dropping them.
            </DialogContentText>
            <List component="div">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {quickSortCollection(
                        collection,
                        editedCollectionOrder
                      ).map((painting, index) => {
                        const isEditing = painting.id === editMode;

                        if (isEditing) {
                          return (
                            <ListItem>
                              <img
                                src={painting.image}
                                height={128}
                                width={128}
                              />
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
                                  value={painting.name}
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
                                <Button
                                  onClick={() => setEditMode(painting.id)}
                                >
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
                                  primary={painting.name}
                                  secondary={painting.description}
                                />
                                <Button
                                  onClick={() => setEditMode(painting.id)}
                                >
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
                    <>
                      <Button
                        onClick={() => {
                          hiddenFileInputRef.current.click();
                        }}
                      >
                        Add image
                      </Button>
                      <input
                        type={"file"}
                        ref={hiddenFileInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          handleUploadPaintingPicture(
                            file,
                            loggedInUser,
                            (url: string) => {
                              setNewPainting({
                                ...newPainting,
                                image: url,
                              });
                            }
                          );
                        }}
                      />
                    </>
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
            <div style={{ width: "100%" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setDeleteConfirmation(true)}
              >
                Delete Collection
              </Button>
            </div>
            <Button onClick={() => setOpen(false)}>Close</Button>
            <Button onClick={handleOnCollectionSave}>Save</Button>
          </DialogActions>
        </>
      )}

      {/* Delete collection confirmation Dialog. */}
      <Dialog
        fullWidth
        PaperProps={{
          style: {
            maxHeight: "100vh",
            margin: 0,
            backgroundColor: theme.palette.background.default,
            boxShadow: "24px",
            borderRadius: 12,
            backgroundImage: "unset",
          },
        }}
        maxWidth={"md"}
        open={deleteConfirmation}
      >
        <DialogTitle>Delete Collection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Your about to delete '${selectedCollection?.name}', are you sure?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmation(false)}>Cancel</Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleOnCollectionDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default EditCollectionDialog;
