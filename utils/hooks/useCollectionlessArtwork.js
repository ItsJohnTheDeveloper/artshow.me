import { useEffect, useState } from "react";
import axios from "axios";

const useCollectionlessArtwork = (artistId) => {
  const [collectionlessArtwork, setCollectionlessArtwork] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdatingData, setIsUpdatingData] = useState(false);

  useEffect(() => {
    const getData = async () => {
      // query all artwork that doesn't belong in a collection
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          "/collection/getAllCollectionlessArt",
          {
            params: { userId: artistId },
          }
        );
        setCollectionlessArtwork(data);
      } catch (err) {
        setError("an error occured");
        setIsLoading(false);
      }
      setIsUpdatingData(false);
    };
    getData();
  }, [isUpdatingData]);

  const updateData = () => {
    setIsUpdatingData(true);
  };

  return { collectionlessArtwork, isLoading, error, updateArtwork: updateData };
};

export default useCollectionlessArtwork;
