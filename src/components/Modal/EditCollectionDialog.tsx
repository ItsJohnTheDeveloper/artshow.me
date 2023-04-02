import { useRef, useState } from "react";
import { Add, Edit, Save } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useSession } from "next-auth/react";

import Spacer from "../Spacer";
import { handleUploadPaintingPicture } from "../../utils/helpers/handleUploadFile";
import {
  useArtistsCollection,
  useArtistsPaintings,
} from "../../utils/hooks/useQueryData";
import theme from "../../styles/theme";

const quickSortCollection = (collection: any[], sortBy: any[]) => {
  return (collection || []).sort(
    (a, b) => sortBy.indexOf(a.id) - sortBy.indexOf(b.id)
  );
};

const EditCollectionDialog = ({ selectedCollectionId, open, setOpen }) => {
  const router = useRouter();
  const artistId = router.query.artist_id as string;

  const { data: session } = useSession();
  const {
    data: collections,
    isLoading: isLoadingCollections,
    mutate: mutateCollections,
  } = useArtistsPaintings(artistId, selectedCollectionId);

  const {
    data: collection,
    isLoading: isLoadingCollection,
    mutate: mutateCollection,
  } = useArtistsCollection(selectedCollectionId);

  const isLoading = isLoadingCollections || isLoadingCollection;

  console.log({ collections, collection });

  const hiddenFileInputRef = useRef(null);
  const [editMode, setEditMode] = useState("");
  const [paintingToEdit, setPaintingToEdit] = useState(null);
  const [addingNewPainting, setAddingNewPainting] = useState(false);
  const [newPainting, setNewPainting] = useState(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [editedCollectionOrder, setEditedCollectionOrder] = useState([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(collection?.title);

  // TODO fix this
  // const handleOnNewPaintingCreate = async () => {
  //   const fullPaintingObject = {
  //     ...newPainting,
  //     width: 123,
  //     height: 123,
  //     collectionIds: [collection.id],
  //     userId: session?.user.id,
  //   };

  //   try {
  //     const { data } = await axios.post(
  //       "/paintings/create",
  //       fullPaintingObject
  //     );
  //     // revalidate cache with newly created painting
  //     mutate([...collection, data]);
  //   } catch (err) {
  //     console.error(err);
  //   }

  //   //  reset the creating painting state
  //   setAddingNewPainting(false);
  //   setNewPainting({});
  // };

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
      collections,
      result.source.index,
      result.destination.index
    );
    const itemIds = items.map((item) => item.id);
    setEditedCollectionOrder(itemIds);
  };

  const handleOnCollectionSave = async () => {
    try {
      await axios.patch(`/collections/${collection.id}`, {
        order: editedCollectionOrder,
      });
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOnCollectionSaveTitle = async () => {
    try {
      await axios.patch(`/collections/${collection.id}`, {
        name: title,
      });
      mutateCollection({ ...collection, name: title });
      setIsEditingTitle(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOnCollectionDelete = async () => {
    try {
      await axios.delete(`/collections/${collection.id}`);
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOnPaintingEdit = async () => {
    try {
      await axios.patch(`/paintings/${editMode}`, paintingToEdit);
      setPaintingToEdit(null);
      setEditMode("");

      // revalidate cache with new edited painting
      mutateCollections();
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress color="success" />
      </div>
    );
  }

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
      <>
        <DialogTitle>
          {isEditingTitle ? (
            <div style={{ display: "flex" }}>
              <TextField
                id="standard-basic"
                label="Standard"
                variant="standard"
                onChange={({ target: { value } }) => setTitle(value)}
                defaultValue={collection?.name}
              >
                {collection?.name}
              </TextField>
              <Spacer x={2} />
              <Button variant="text" onClick={handleOnCollectionSaveTitle}>
                Save
              </Button>
              <Button variant="text" onClick={() => setIsEditingTitle(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div style={{ display: "flex" }}>
              <Typography variant="h4" fontStyle={"italic"}>
                {collection?.name}
              </Typography>
              <Spacer x={2} />
              <IconButton
                aria-label="edit"
                onClick={() => setIsEditingTitle(true)}
                size="small"
              >
                <Edit />
              </IconButton>
            </div>
          )}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can add, edit, remove, or change the order of your painting by
            dragging and dropping them.
          </DialogContentText>
          <List component="div">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {quickSortCollection(
                      collections,
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
                                defaultValue={painting.name}
                                onChange={({ target: { value } }) =>
                                  setPaintingToEdit({
                                    ...paintingToEdit,
                                    name: value,
                                  })
                                }
                              />
                              <Spacer y={1} />
                              <TextField
                                id="outlined-description"
                                label="Description"
                                defaultValue={painting.description}
                                onChange={({ target: { value } }) =>
                                  setPaintingToEdit({
                                    ...paintingToEdit,
                                    description: value,
                                  })
                                }
                              />
                            </div>
                            <div style={{ right: 0, position: "absolute" }}>
                              <Button onClick={handleOnPaintingEdit}>
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
            {/* TODO fix add painting in collection functionality */}

            {/* {addingNewPainting ? (
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
                          try {
                            handleUploadPaintingPicture(
                              file,
                              session.user,
                              (url: string) => {
                                setNewPainting({
                                  ...newPainting,
                                  image: url,
                                });
                              }
                            );
                          } catch (err) {}
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
              )} */}
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
            {`Your about to delete '${collection?.name}', are you sure?`}
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
