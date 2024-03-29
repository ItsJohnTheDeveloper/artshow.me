import {
  Alert,
  Button,
  CircularProgress,
  FormHelperText,
  Snackbar,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import { EditPaintingForm } from "../../../../models/Painting";
import { handleUploadPaintingPicture } from "../../../../utils/helpers/handleUploadFile";
import {
  useArtistsCollections,
  useColsByPainting,
} from "../../../../utils/hooks/useQueryData";
import ArtDimensionsForm from "../../../Common/ArtDimensionsForm";
import ReactSelect from "../../../Common/ReactSelect";
import Spacer from "../../../Common/Spacer";

const EditArtForm = ({ data, handleCancelEditing, boundMutate }) => {
  const methods = useForm();
  const { register, control, handleSubmit, setValue, watch } = methods;

  const { mutate: globalMutate } = useSWRConfig();
  const { data: session } = useSession();

  const { data: usersCollections } = useArtistsCollections(session?.user?.id);

  const { data: collectionsPaintingBelongsTo } = useColsByPainting(data?.id);

  // Set the default collections that this painting belongs to.
  useEffect(() => {
    if (collectionsPaintingBelongsTo?.length) {
      setValue(
        "collections",
        collectionsPaintingBelongsTo?.map((item) => ({
          value: item.id,
          label: item.name,
        }))
      );
    }
  }, [collectionsPaintingBelongsTo]);

  const [showSizeInput, setShowSizeInput] = useState(data?.showSize || false);
  const [serverMessage, setServerMessage] = useState(null);
  const [isUpdatingArtwork, setIsUpdatingArtwork] = useState(false);
  const editContainerRef = useRef(null);

  const hiddenFileInputRef = useRef(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const watchedImage = watch("image");

  useEffect(() => {
    setTimeout(() => {
      editContainerRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const handleOnSubmit = async (formData: EditPaintingForm) => {
    setIsUpdatingArtwork(true);

    interface PaintingUpdate {
      name?: string;
      description?: string;
      image?: string;
      width?: number;
      height?: number;
      sizeUnit?: string;
      showSize?: boolean;
      collectionIds?: string[];
    }

    let painting: PaintingUpdate = {
      showSize: showSizeInput,
    };

    if (formData?.name) {
      painting.name = formData.name;
    }
    if (formData?.description) {
      painting.description = formData.description;
    }
    if (formData?.image) {
      painting.image = formData.image;
    }
    if (formData?.sizeUnit && formData?.width && formData?.height) {
      painting.width = Number(formData.width);
      painting.height = Number(formData.height);
      painting.sizeUnit = formData.sizeUnit;
    }
    if (formData?.sizeUnit) {
      painting.sizeUnit = formData.sizeUnit;
    }

    if (formData?.collections) {
      const collectionList = formData.collections.map(
        (collection) => collection.value
      );
      painting.collectionIds = collectionList;
    }

    try {
      const { data: resData } = await axios.patch(
        `/paintings/${data.id}`,
        painting
      );
      boundMutate(resData);
      setServerMessage("Artwork updated successfully");
    } catch (err) {
      setServerMessage(err?.response?.data?.message);
    } finally {
      setIsUpdatingArtwork(false);
      handleCancelEditing();

      // revalidate collection data
      globalMutate(
        `/api/collection/getCollections?userId=${data.userId}&id=all`
      );
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div>
            <Button
              fullWidth
              style={{ height: 75 }}
              onClick={() => {
                hiddenFileInputRef.current.click();
              }}
              disabled={isUploadingImage}
            >
              {isUploadingImage ? "Uploading image..." : "Change image"}
            </Button>
            <input
              type={"file"}
              ref={hiddenFileInputRef}
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                setIsUploadingImage(true);
                try {
                  handleUploadPaintingPicture(
                    file,
                    session.user,
                    (url: string) => {
                      setValue("image", url);
                      setIsUploadingImage(false);
                    }
                  );
                  // TODO: add revalidation to collection data to show newly added image
                } catch (err) {
                  setServerMessage(err?.response?.data?.message);
                  setIsUploadingImage(false);
                }
              }}
            />
            <img
              src={watchedImage || data.image}
              style={{ width: "100%", height: "auto", opacity: 0.8 }}
            />
          </div>
          <Spacer y={1} />
          <span ref={editContainerRef} />
          <Controller
            control={control}
            name="collections"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <ReactSelect
                label={"Collections"}
                isMulti
                onChange={onChange}
                options={(usersCollections || []).map((col) => ({
                  value: col.id,
                  label: col.name,
                }))}
                default
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
          <div>
            <TextField
              {...register("name", { required: true })}
              fullWidth
              label="Name"
              variant="outlined"
              defaultValue={data.name}
            />
            <Spacer y={2} />
            <TextField
              {...register("description", { required: true })}
              fullWidth
              multiline
              maxRows={7}
              label="Description"
              variant="outlined"
              defaultValue={data.description}
            />
            <Spacer y={2} />
            <ArtDimensionsForm
              defaultValues={{
                sizeUnit: data.sizeUnit,
                width: data.width,
                height: data.height,
              }}
              showSizeInput={showSizeInput}
              setShowSizeInput={setShowSizeInput}
            />
            <Spacer y={2} />
            <Button variant="text" type={"submit"}>
              {isUpdatingArtwork ? (
                <CircularProgress color="success" size={20} />
              ) : (
                "save"
              )}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancelEditing}
            >
              {"cancel"}
            </Button>
          </div>
        </form>
      </FormProvider>
      <Snackbar
        open={serverMessage}
        autoHideDuration={6000}
        onClose={() => setServerMessage(null)}
      >
        <Alert
          elevation={6}
          onClose={() => setServerMessage(null)}
          severity="success"
          sx={{ width: "100%" }}
          variant="filled"
        >
          {serverMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditArtForm;
