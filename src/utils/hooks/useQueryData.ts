import axios from "axios";
import useSWR from "swr";
import { User } from "@prisma/client";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useCollectionArt = (colId: string, artId: string) => {
  const url =
    colId &&
    artId &&
    `/collections/getUsersCollection?id=${colId}&artId=${artId}`;
  const { data, error: isError, mutate } = useSWR(url, fetcher);
  return { data, isLoading: url ? !isError && !data : false, isError, mutate };
};

const useArtwork = (id: string) => {
  const url = id && `/paintings/${id}`;
  const { data, error: isError, mutate } = useSWR(url, fetcher);
  return { data, isLoading: url ? !isError && !data : false, isError, mutate };
};

const useArtistsPaintings = (userId: string, colId: string) => {
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

const useArtistsCollections = (id: string) => {
  const url = id ? `/collections/user/${id}` : null;
  const { data, error: isError, mutate } = useSWR(url, fetcher);
  return { data, isLoading: url ? !isError && !data : true, isError, mutate };
};

const useArtistsCollection = (id: string) => {
  let url = null;

  if (id !== "all") {
    url = `/collections/${id}`;
  }
  const { data, error: isError, mutate } = useSWR(url, fetcher);
  return { data, isLoading: url ? !isError && !data : true, isError, mutate };
};

const useArtist = (id: string) => {
  const url = id ? `/users/${id}` : null;
  const { data, error: isError, mutate } = useSWR(url, fetcher);
  const userData: User = data;
  return {
    data: userData,
    isLoading: url ? !isError && !data : true,
    isError,
    mutate,
  };
};

const useColsByPainting = (id: string) => {
  const url = id ? `/collections/painting/${id}` : null;
  const { data, error: isError, mutate } = useSWR(url, fetcher);
  return { data, isLoading: url ? !isError && !data : true, isError, mutate };
};

export {
  useArtwork,
  useCollectionArt,
  useArtistsPaintings,
  useArtistsCollections,
  useArtistsCollection,
  useArtist,
  useColsByPainting,
};
