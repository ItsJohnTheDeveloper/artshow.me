import axios from "axios";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const useArtwork = (id) => {
  const url = id && `/painting/${id}`;
  const { data, error: isError, mutate } = useSWR(url, fetcher);
  console.log({ isError });
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

export { useArtwork, useCollection };
