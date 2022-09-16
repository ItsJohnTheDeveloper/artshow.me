import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

const useArtwork = (id) => {
  const url = id && `/api/painting/${id}`;
  const { data, error: isError } = useSWR(url, fetcher);

  return { data, isLoading: !isError && !data, isError };
};

export default useArtwork;
