import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

const AdminLayout = ({ children, title }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Check if theme is available before accessing breakpoints
  const isMdScreen = useMediaQuery((theme) => theme?.breakpoints?.up("md"));

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: "flex" }} position="relative">
      {drawerOpen && (
        <Box
          onClick={toggleDrawer}
          bgcolor="#00000050"
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
        ></Box>
      )}
      <SideBar setOpen={setDrawerOpen} open={drawerOpen} />
      <Box
        p={4}
        sx={{
          background: "#f4f9ff",
          minHeight: "100vh",
          width: "-webkit-fill-available",
          marginLeft: isMdScreen ? "270px" : "0",
          transition: "0.3s ease-in-out",
        }}
      >
        <TopBar setOpen={setDrawerOpen} open={drawerOpen} title={title} />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
