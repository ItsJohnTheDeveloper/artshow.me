import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import Spacer from "../Spacer";
import { handleUploadPaintingPicture } from "../../utils/helpers/handleUploadFile";
import { useUser } from "../../contexts/user-context";
import axios from "axios";
import ReactSelect from "../Common/ReactSelect";
import { ArtistDocument } from "../../models/Artist";
import { useCollection } from "../../utils/hooks/useQueryData";

type AddArtworkForm = {
  name: string;
  image: string;
  title: string;
  description: string;
  collections: { label: string; value: string }[];
  width: number;
  height: number;
  sizeUnit: string;
};

type AddArtworkDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  artist: ArtistDocument;
};

const AddArtworkDialog = ({ open, setOpen, artist }: AddArtworkDialogProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    reset,
  } = useForm();

  const { getUser: loggedInUser } = useUser();

  const watchedName = watch("name");
  const watchedImage = watch("image");
  const watchedDescription = watch("description");
  const submitDisabled = !watchedName || !watchedImage || !watchedDescription;

  const { data: usersCollections } = useCollection({
    limited: true,
    userId: loggedInUser.id,
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadingArtwork, setUploadingArtwork] = useState(false);
  const [showSizeInput, setShowSizeInput] = useState(false);

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  const hiddenFileInputRef = useRef(null);

  const resetArtworkForm = () => {
    reset();
    setSuccessSnackbarOpen(true);
    setValue("collections", []);
  };

  const handleAddArtworkSubmit = async (data: AddArtworkForm) => {
    setUploadingArtwork(true);

    const paintingObject = {
      name: data.name,
      description: data.description,
      image: data.image,
      width: null,
      height: null,
      sizeUnit: null,
      userId: loggedInUser.id,
      collectionIds: [],
    };

    if (showSizeInput && data?.width && data?.height && data?.sizeUnit) {
      paintingObject.width = Number(data.width);
      paintingObject.height = Number(data.height);
      paintingObject.sizeUnit = data.sizeUnit;
    }

    if (data?.collections?.length) {
      const collectionList = data.collections.map(
        (collection) => collection.value
      );
      paintingObject.collectionIds = collectionList;
    }

    try {
      await axios.post("/painting/create", paintingObject, {
        headers: { Authorization: `Bearer ${loggedInUser?.accessToken}` },
      });
      setUploadingArtwork(false);

      // clear the artwork form.
      resetArtworkForm();
    } catch (err) {
      // TODO: handle error later
      console.error(err);
      setUploadingArtwork(false);
    }
  };

  const closeDialog = () => {
    setOpen(false);
    clearErrors("name");
  };

  return (
    <Dialog
      maxWidth={"sm"}
      open={open}
      onClose={closeDialog}
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "#212730",
          boxShadow: "24px",
          borderRadius: 12,
          backgroundImage: "unset",
        },
      }}
    >
      <DialogTitle>Add new Artwork</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleAddArtworkSubmit)}>
          <Spacer y={2} />
          <Controller
            control={control}
            name="collections"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <ReactSelect
                label={"Collections"}
                isMulti
                onChange={onChange}
                options={usersCollections?.map((col) => ({
                  value: col.id,
                  label: col.name,
                }))}
                placeholder={"No Collection"}
                onBlur={onBlur}
                value={value}
                ref={ref}
              />
            )}
          />
          <FormHelperText style={{ paddingLeft: 12 }}>
            {`Add Artwork to your Collection(s).`}
          </FormHelperText>
          <Spacer y={2} />
          <TextField
            fullWidth
            id="outlined-name"
            label="Artwork Name"
            variant="outlined"
            {...register("name", { required: true })}
          />
          <Spacer y={2} />
          {watchedImage && (
            <img
              src={watchedImage}
              height={150}
              width={550}
              style={{ objectFit: "cover" }}
            />
          )}
          {!watchedImage && (
            <>
              <Button
                fullWidth
                style={{ height: 150 }}
                onClick={() => {
                  hiddenFileInputRef.current.click();
                }}
                disabled={isUploadingImage}
              >
                {isUploadingImage ? "Uploading image..." : "Add image"}
              </Button>
              <input
                type={"file"}
                ref={hiddenFileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setIsUploadingImage(true);
                  handleUploadPaintingPicture(
                    file,
                    loggedInUser.id,
                    (url: string) => {
                      setValue("image", url);
                      setIsUploadingImage(false);
                    }
                  );
                }}
              />
            </>
          )}
          <Spacer y={2} />
          {watchedName && watchedImage && (
            <>
              <TextField
                fullWidth
                id="outlined-description"
                variant="outlined"
                label="Description"
                {...register("description", { required: true })}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showSizeInput}
                      onChange={() => setShowSizeInput(!showSizeInput)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Show art dimensions"
                />

                {showSizeInput && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 0px",
                    }}
                  >
                    <TextField
                      id="outlined-height"
                      label="Height"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 81 }}
                      {...register("height", { required: true })}
                    />
                    <span style={{ margin: "0px 12px" }}>X</span>
                    <TextField
                      id="outlined-width"
                      label="Width"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 81 }}
                      {...register("width", { required: true })}
                    />
                    <Spacer x={2} />
                    <TextField
                      id="outlined-unit-measurement"
                      select
                      label="Unit"
                      value={showSizeInput ? "in" : null}
                      onChange={() => {}}
                      {...register("sizeUnit", { required: true })}
                    >
                      {[{ value: "in", label: "in" }].map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                )}
              </div>
            </>
          )}
          {errors.name && (
            <Typography variant="body1" color={"#c33333"}>
              Name required
            </Typography>
          )}
          <Spacer y={4} />
          <Button
            variant="contained"
            type={"submit"}
            disabled={submitDisabled || uploadingArtwork}
          >
            {uploadingArtwork ? "Uploading..." : "Upload Art"}
          </Button>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Close</Button>
      </DialogActions>

      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSuccessSnackbarOpen(false)}
      >
        <Alert
          elevation={6}
          onClose={() => setSuccessSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
          variant="filled"
        >
          {`Artwork successfully added!`}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AddArtworkDialog;
