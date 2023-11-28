import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/material";

const CheckboxCard = ({ id, title, shopCode, onCardClick }) => {
  const [isActive, setIsActive] = useState(false);

  const handleCardClick = () => {
    setIsActive(!isActive);
    // Pass the card ID and the current selection status to the parent component
    onCardClick(id, !isActive);
  };

  return (
    <Card
      onClick={handleCardClick}
      style={{ backgroundColor: isActive ? "#e0e0e0" : "white" }}
    >
      <CardContent
        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <Checkbox checked={isActive} color="primary" />
        <Box>
          <Typography
            variant="h5"
            component="div"
            fontWeight={600}
            fontSize={"16px"}
            py={"5px"}
          >
            {title}
          </Typography>
          <Typography color="text.secondary" gutterBottom fontSize={"14px"}>
            Shop code : {shopCode}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CheckboxCard;
