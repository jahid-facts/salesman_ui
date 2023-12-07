import { Menu } from "@mui/icons-material";
import { Box, Typography, Grid } from "@mui/material";
import React from "react";
import AvatarMenu from "./Avater";
import { useAuthInfo } from "../../hooks/AuthCheckHooks";

const TopBar = ({ setOpen, open, title }) => {
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const authUser = useAuthInfo();
  return (
    <>
      <Box
        borderRadius={3}
        mb={3}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        
      >
        <Grid container spacing={2} alignItems="center">
          {/* First Box */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body1" fontSize={"14px"} fontWeight={"500"}>
                Pages / {title}
              </Typography>
              <Typography variant="h5" fontWeight={"bold"}>
                {title}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"flex-end"}
              borderRadius={"30px"}
              // boxShadow={'boxShadow'}
              p={1}
              pl={{ md: 2 }}
              bgcolor={"#ffffff"}
              sx={{
                float: "right",
                width: { xs: "-webkit-fill-available", md: "fit-content" },
              }}
            >
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                <Box
                  color="inherit"
                  aria-label="Open sidebar"
                  edge="start"
                  onClick={toggleDrawer}
                  sx={{
                    cursor: "pointer",
                    display: { xs: "block", md: "none" },
                    ml: 2,
                    mt: 1,
                  }}
                >
                  <Menu />
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                  <Box
                    sx={{
                      pl: "10px",
                      marginRight: "30px",
                      display: {
                        xs: "none",
                        md: "block",
                      },
                    }}
                  >
                    <Typography variant="h1" fontSize={"12px"} fontWeight={500}>
                      {authUser.name}
                    </Typography>
                    <Typography variant="caption" fontSize={"10px"}>
                      {authUser.email}
                    </Typography>
                  </Box>
                  <AvatarMenu />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default TopBar;
