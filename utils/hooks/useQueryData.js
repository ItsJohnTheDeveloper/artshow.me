import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

const useArtwork = (id) => {
  const url = id && `/api/painting/${id}`;
  const { data, error: isError } = useSWR(url, fetcher);

  return { data, isLoading: !isError && !data, isError };
};

const useCollection = (params = undefined) => {
  const queryParams = params ? `?${new URLSearchParams(params)}` : "";
  const url = queryParams && `/api/collection/getCollections${queryParams}`;
  const { data, error: isError, mutate } = useSWR(url, fetcher);

  return { data, isLoading: !isError && !data, isError, mutate };
};

export { useArtwork, useCollection };
