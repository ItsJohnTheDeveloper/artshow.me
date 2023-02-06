import axios from "axios";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const useCollectionArt = (colId, artId) => {
  const url =
    colId &&
    artId &&
    `/collections/getUsersCollection?id=${colId}&artId=${artId}`;
  const { data, error: isError, mutate } = useSWR(url, fetcher);
  return { data, isLoading: url ? !isError && !data : false, isError, mutate };
};

const useArtwork = (id) => {
  const url = id && `/paintings/${id}`;
  const { data, error: isError, mutate } = useSWR(url, fetcher);
  return { data, isLoading: url ? !isError && !data : false, isError, mutate };
};

const useArtistsPaintings = (userId, colId) => {
  if (!userId) {
    throw new Error("userId is required for useCollection hook");
  }

  let url = null;
  if (colId === "all") {
    url = `/paintings/user/${userId}`;
  } else {
    url = colId && `/paintings/collection/${colId}`;
  }
  const {
    data,
    error: isError,
    mutate,
  } = useSWR(url, fetcher, { revalidateIfStale: true });

  return { data, isLoading: url ? !isError && !data : false, isError, mutate };
};

const useArtistsCollections = (id) => {
  const url = id ? `/collections/user/${id}` : null;
  const { data, error: isError, mutate } = useSWR(url, fetcher);
  return { data, isLoading: url ? !isError && !data : true, isError, mutate };
};

const useArtist = (id) => {
  const url = id ? `/users/${id}` : null;
  const { data, error: isError, mutate } = useSWR(url, fetcher);
  return { data, isLoading: url ? !isError && !data : true, isError, mutate };
};

const useColsByPainting = (id) => {
  const url = id ? `/collection/getColsByPainting?artId=${id}` : null;
  const { data, error: isError, mutate } = useSWR(url, fetcher);
  return { data, isLoading: url ? !isError && !data : true, isError, mutate };
};

export {
  useArtwork,
  useCollectionArt,
  useArtistsPaintings,
  useArtistsCollections,
  useArtist,
  useColsByPainting,
};
