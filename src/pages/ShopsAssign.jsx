import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminLayout/AdminLayout";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CheckboxCard from "../components/CheckBox";
import { getApi, postApi } from "../config/configAxios";
import CustomLoader from "../components/customLoader/CustomLoader";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { FilterAltRounded } from "@mui/icons-material";
import { rcOptions } from "../components/RC";

const ShopsAssign = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [shopList, setShopList] = useState([]);
  const [salesman, setSalesman] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");

  const handleCardClick = (cardId, isSelected) => {
    if (isSelected) {
      // Add the card ID to the selectedCards array
      setSelectedCards([...selectedCards, cardId]);
    } else {
      // Remove the card ID from the selectedCards array
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
    }
  };

  const fetchSalesman = async () => {
    setLoading(true);
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

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : "";
    setSelectedDate(formattedDate);
  };

  const handleSubmit = async () => {
    setisSubmitting(true);
    try {
      const data = {
        shop_id: selectedCards,
        user_id: selectedUser,
        assign_date: selectedDate,
      };
      const response = await postApi("task-assign", data);
      toast.success(response.data.message);
      // Reset form fields after successful submission
      setSelectedUser("");
      setSelectedDate(null);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data[0]);
      } else if (error.request) {
        toast.error("No response from the server");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setisSubmitting(false);
    }
  };

  // handle fillter
  const handleFilter = async () => {
    setLoading(true);
    try {
      const rc1 = value.value;
      const response = await getApi(`rc-shop/${rc1}`);
      setShopList(response?.data?.task);
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={"Shops Assign"}>
      <Helmet>
        <title>Shops assign</title>
      </Helmet>
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
                    (data) => data.role !== "admin" && data.status === "active"
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
                value={selectedDate ? dayjs(selectedDate) : null}
                onChange={handleDateChange}
                renderInput={(props) => (
                  <TextField
                    {...props}
                    variant="outlined"
                    label="Custom Date"
                  />
                )}
                disablePast
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
            sx={{ mt: 8 }}
            fullWidth
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <h4>Select shops</h4>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display={"flex"}>
            <Autocomplete
              size="small"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              id="controllable-states-demo"
              options={rcOptions}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="select" />}
            />

            <div>
              <Button
                onClick={handleFilter}
                sx={{
                  textTransform: "capitalize",
                  ml: 2,
                }}
                variant="contained"
                color="primary"
              >
                <FilterAltRounded sx={{ color: "f3f3f3", pr: 1 }} />
                Filter
              </Button>
            </div>
          </Box>
        </Grid>

        {loading ? (
          <CustomLoader />
        ) : (
          shopList
            .filter((item) => item.status === "active")
            .map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <CheckboxCard
                  id={item?.id}
                  title={item?.name}
                  shopCode={item?.shop_code}
                  rc={item?.rc}
                  address={item?.address}
                  onCardClick={handleCardClick}
                />
              </Grid>
            ))
        )}
      </Grid>
    </AdminLayout>
  );
};

export default ShopsAssign;
