import { useScrollTrigger } from "@mui/material";

const useNavScroll = () => {
  const config = {
    disableHysteresis: true,
    // add any config options here
  };
  return useScrollTrigger(config);
};

export default useNavScroll;
