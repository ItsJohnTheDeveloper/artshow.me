import { useEffect, useState } from "react";
import axios from "axios";
import { showAllOption } from "../helpers/getDefaultValues";

const useGallery = (collectionId, artistId) => {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdatingData, setIsUpdatingData] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const params = { userId: artistId, id: collectionId };
        if (collectionId === showAllOption.id) {
          params.all = true;
        }
        const { data } = await axios.get("/collection/getCollections", {
          params,
        });

        setGallery(data);

        setIsLoading(false);
      } catch (err) {
        setError("an error occured");
        setIsLoading(false);
      }
      setIsUpdatingData(false);
    };
    getData();
  }, [collectionId, isUpdatingData]);

  const updateData = () => {
    setIsUpdatingData(true);
  };

  return { gallery, isLoading, error, updateGallery: updateData };
};

export default useGallery;
