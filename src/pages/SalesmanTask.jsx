import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminLayout/AdminLayout";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { getApi } from "../config/configAxios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import CustomLoader from "../components/customLoader/CustomLoader";
import { BeatLoader } from "react-spinners";
import { Helmet } from "react-helmet";

const SalesmanTask = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [shopList, setShopList] = useState([]);
  const [salesman, setSalesman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleCardClick = (cardId, isSelected) => {
    if (isSelected) {
      // Add the card ID to the selectedCards array
      setSelectedCards([...selectedCards, cardId]);
    } else {
      // Remove the card ID from the selectedCards array
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
    }
  };

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : "";
    setSelectedDate(formattedDate);
  };

  const fetchSalesman = async () => {
    try {
      const response = await getApi("users");
      setSalesman(response?.data?.users);
    } catch (error) {
      toast.error("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSalesman();
  }, []);

  const handleSubmit = async () => {
    setSubmiting(true);
    try {
      const response = await getApi(
        `find-task/${selectedUser}/${selectedDate}`
      );
      setShopList(response.data.task);

      toast.success(response.data.message);
    } catch (error) {
      if (error.response) {
        toast.error(error?.response?.data[0]);
      } else if (error.request) {
        toast.error("No response from the server");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setSubmiting(false);
    }
  };

  // handle delete
  const taskDeleteHandle = async (itemId) => {
    if (!itemId) {
      console.error("Item ID is undefined or null");
      return;
    }

    try {
      const response = await axios.delete(`task-delete/${itemId}`);

      // If you want to update the UI immediately, you can do something like this:
      const updatedShopList = shopList.filter((item) => item.id !== itemId);
      setShopList(updatedShopList);
      toast.success(response?.data?.message);
    } catch (error) {
      if (error.response) {
        toast.error(error?.response?.data[0]);
      } else {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  return (
    <AdminLayout title={"Fillter task"}>
      <Helmet>
        <title>Fillter task</title>
      </Helmet>
      {loading ? (
        <CustomLoader />
      ) : (
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <h4>Salesman</h4>
            <div>
              <Select
                value={selectedUser}
                onChange={handleChange}
                fullWidth
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select a salesman
                </MenuItem>
                {salesman &&
                  salesman.length > 0 &&
                  salesman
                    .filter(
                      (data) =>
                        data.role !== "admin" && data.status === "active"
                    )
                    .map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
              </Select>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <h4>Date</h4>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={null}
                  onChange={handleDateChange}
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      variant="outlined"
                      label="Custom Date"
                    />
                  )}
                  slotProps={{ textField: { fullWidth: true } }}
                  // Add more props for customization
                />
              </LocalizationProvider>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              size="large"
              fullWidth
              disabled={submiting}
              sx={{ mt: 8 }}
            >
              {submiting ? <BeatLoader color="#ff0000" /> : "Submit"}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <h4>Assign shpos</h4>
          </Grid>
          {shopList.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                onClick={handleCardClick}
                style={{ backgroundColor: "white" }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      component="div"
                      fontWeight={600}
                      fontSize={"16px"}
                      py={"5px"}
                    >
                      {item.assign_by_shop.name}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      gutterBottom
                      fontSize={"14px"}
                    >
                      Date : {item.assign_date}
                    </Typography>
                    {item?.status === "completed" && item?.distance && (
                      <Typography
                        color="text.secondary"
                        gutterBottom
                        fontSize={"14px"}
                      >
                        Distance : {item?.distance} m
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <div>
                      {item.status === "completed" ? (
                        <Chip size="small" label="completed" color="primary" />
                      ) : (
                        <Chip
                          size="small"
                          label="in-completed"
                          color="secondary"
                        />
                      )}
                    </div>
                    <Box textAlign={"right"} mt={1}>
                      <IconButton onClick={() => taskDeleteHandle(item.id)}>
                        <Delete
                          sx={{
                            color: "#ff0000",
                            cursor: "pointer",
                          }}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </AdminLayout>
  );
};

export default SalesmanTask;
