import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminLayout/AdminLayout";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Popover,
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
import { Close, FilterAltRounded } from "@mui/icons-material";

const ShopsAssign = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [shopList, setShopList] = useState([]);
  const [salesman, setSalesman] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterShop, setFilterShop] = useState([]);
  const [filter, setFilter] = useState(null);

  const handleCardClick = (cardId, isSelected) => {
    if (isSelected) {
      // Add the card ID to the selectedCards array
      setSelectedCards([...selectedCards, cardId]);
    } else {
      // Remove the card ID from the selectedCards array
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
    }
  };

  const fetchShops = async () => {
    setLoading(true);
    try {
      const response = await getApi("shop");
      setShopList(response.data.shop);
    } catch (error) {
      toast.error("An error occurred while fetching data.", error);
    } finally {
      setLoading(false);
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
    fetchShops();
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

  // filter
  // filter option
  const options = [
    { label: "AC 1", value: "ac1" },
    { label: "AC 2", value: "ac2" },
    { label: "AC 3", value: "ac3" },
    { label: "AC 4", value: "ac4" },
    { label: "AC 5", value: "ac5" },
    { label: "AC 6", value: "ac6" },
    { label: "AC 7", value: "ac7" },
  ];

  const handleFilterOpen = (event) => {
    setFilter(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilter(null);
  };

  const handleFilterToggle = (filterValue) => {
    setLoading(true);
    const isFilterSelected = selectedFilters.includes(filterValue);

    if (isFilterSelected) {
      setSelectedFilters((prevFilters) =>
        prevFilters.filter((filter) => filter !== filterValue)
      );
    } else {
      setSelectedFilters((prevFilters) => [...prevFilters, filterValue]);
    }
  };

  useEffect(() => {
    if (selectedFilters.length === 0) {
      setFilterShop(shopList);
    } else {
      const filteredProperties = shopList.filter((data) => {
        return selectedFilters.includes(data.rc);
      });

      setFilterShop(filteredProperties);
    }
    setLoading(false);
  }, [selectedFilters, shopList]);
 
  console.log(selectedFilters);
  console.log(shopList);

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
          <Box display={"flex"} justifyContent={"space-between"}>
            <h4>Select shpos</h4>
            <div>
              <Button
                onClick={handleFilterOpen}
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "30px",
                }}
                variant="outlined"
                color="primary"
              >
                <FilterAltRounded sx={{ color: "f3f3f3", pr: 1 }} />
                Filters
              </Button>
            </div>
          </Box>
        </Grid>

        {loading ? (
          <CustomLoader />
        ) : (
          filterShop
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

      {/* filter  */}
      <Popover
        open={Boolean(filter)}
        anchorEl={filter}
        onClose={handleFilterClose}
        sx={{
          top: "45px",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box display={"flex"} flexDirection={"column"} p={3}>
          <FormGroup>
            {options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selectedFilters.includes(option.value)}
                    onChange={() => handleFilterToggle(option.value)}
                  />
                }
                label={option.label}
                sx={{ textTransform: "capitalize" }}
              />
            ))}
          </FormGroup>
          <Button
            size="small"
            variant="contained"
            color={"secondary"}
            onClick={handleFilterClose}
            sx={{ mt: 1, textTransform: "capitalize" }}
          >
            <Close sx={{ fontSize: "16px" }} /> Close
          </Button>
        </Box>
      </Popover>
    </AdminLayout>
  );
};

export default ShopsAssign;
