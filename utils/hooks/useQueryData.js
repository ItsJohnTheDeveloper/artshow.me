import axios from "axios";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const useArtwork = (id) => {
  const url = id && `/painting/${id}`;
  const { data, error: isError, mutate } = useSWR(url, fetcher);
  return { data, isLoading: url ? !isError && !data : false, isError, mutate };
};

const useCollection = (params = undefined) => {
  const queryParams = params ? `?${new URLSearchParams(params)}` : "";
  const url = queryParams && `/collection/getCollections${queryParams}`;
  const {
    data,
    error: isError,
    mutate,
  } = useSWR(url, fetcher, { revalidateIfStale: true });

  return { data, isLoading: url ? !isError && !data : false, isError, mutate };
};

const useArtist = (id) => {
  const url = id && `/users/${id}`;
  const { data, error: isError, mutate } = useSWR(url, fetcher);
  return { data, isLoading: url ? !isError && !data : true, isError, mutate };
};

export { useArtwork, useCollection, useArtist };
