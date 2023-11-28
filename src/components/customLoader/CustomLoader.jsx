import { Box } from "@mui/material";
import React from "react";
import { ClipLoader } from "react-spinners";

const CustomLoader = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      width={"100%"}
    >
      <ClipLoader color="#ff0000" size={'40px'} />
    </Box>
  );
};

export default CustomLoader;
