import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { BeatLoader } from "react-spinners";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function TransitionsModal({
  children,
  handleSubmit,
  open,
  setOpen,
  title,
  isSubmitting,
}) {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={false}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography
                id="transition-modal-title"
                sx={{ mb: 3 }}
                variant="h6"
                component="h2"
              >
                {title}
              </Typography>
              <IconButton
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  color: "red",
                }}
                onClick={() => setOpen(false)}
              >
                <Close />
              </IconButton>
            </Box>

            <Box>{children}</Box>
            <Button
              fullWidth
              variant="contained"
              sx={{ textTransform: "capitalize", mt: 3 }}
              onClick={() => { 
                handleSubmit();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <BeatLoader color="#ff0000" /> : "Submit"}
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
