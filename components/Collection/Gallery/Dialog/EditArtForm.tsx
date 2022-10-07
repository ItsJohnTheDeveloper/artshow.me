import { Photo } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import { useUser } from "../../../../contexts/user-context";
import { EditPaintingForm } from "../../../../models/Painting";
import ArtDimensionsForm from "../../../Common/ArtDimensionsForm";
import Spacer from "../../../Spacer";

const EditArtForm = ({ data, handleCancelEditing, boundMutate }) => {
  const methods = useForm();
  const { register, handleSubmit } = methods;

  const { mutate: globalMutate } = useSWRConfig();
  const { getUser: loggedInUser } = useUser();

  const [showSizeInput, setShowSizeInput] = useState(data.sizeUnit || false);
  const [serverMessage, setServerMessage] = useState(null);
  const [isUpdatingArtwork, setIsUpdatingArtwork] = useState(false);
  const editContainerRef = useRef(null);

  //   TODO: implement change art photo functionality

  console.log({ data });
  useEffect(() => {
    setTimeout(() => {
      editContainerRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const handleOnSubmit = async (formData: EditPaintingForm) => {
    setIsUpdatingArtwork(true);

    // TODO: handle formatting size in backend
    if (
      showSizeInput &&
      formData?.sizeUnit &&
      formData?.width &&
      formData?.height
    ) {
      formData.width = Number(formData.width);
      formData.height = Number(formData.height);
    } else {
      formData.width = null;
      formData.height = null;
      formData.sizeUnit = null;
    }

    try {
      console.log({ formData });
      const { data: resData } = await axios.patch(
        `/painting/update?id=${data.id}`,
        { data: formData },
        {
          headers: { Authorization: `Bearer ${loggedInUser?.accessToken}` },
        }
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={data.image}
              style={{ width: "75%", height: "auto", opacity: 0.8 }}
            />
            <IconButton aria-label="change" onClick={() => {}} size="small">
              <Photo />
              <Spacer x={1} />
              change image
            </IconButton>{" "}
          </div>
          <Spacer y={1} />
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
            <div ref={editContainerRef}>
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
