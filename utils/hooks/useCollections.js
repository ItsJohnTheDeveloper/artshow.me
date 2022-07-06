import { useEffect, useState } from "react";
import axios from "axios";
import { showAllOption } from "../helpers/getDefaultValues";

const useCollections = (selectedCollection, artistId) => {
  const [collectionGallery, setCollectionGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      // query all collections
      setIsLoading(true);
      try {
        if (selectedCollection.id === showAllOption.id) {
          const { data } = await axios.get("/collection/getAllCollections", {
            params: { userId: artistId },
          });
          setCollectionGallery(data);
        } else {
          // query specific collection
          const { data } = await axios.get("/collection/getCollections", {
            params: { id: selectedCollection.id },
          });
          setCollectionGallery(data);
        }
        setIsLoading(false);
      } catch (err) {
        setError("an error occured");
        setIsLoading(false);
      }
    };
    getData();
  }, [selectedCollection]);

  return { collectionGallery, isLoading, error };
};

export default useCollections;
