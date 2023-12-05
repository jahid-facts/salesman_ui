import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminLayout/AdminLayout";
import { Button, Grid, MenuItem, Select, TextField } from "@mui/material";
import { getApi, postApi } from "../config/configAxios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import CustomLoader from "../components/customLoader/CustomLoader";
import { BeatLoader } from "react-spinners";
import { Helmet } from "react-helmet";

const DateRange = () => {
  const [salesman, setSalesman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [findUser, setFindUser] = useState(null);

  const handleChange = async (event) => {
    try {
      const user_id = event.target.value;
      setSelectedUser(user_id);
      const res = await getApi(`user-date-range/${user_id}`);
      setFindUser(
        res?.data?.user === null
          ? {
              user_id: user_id,
              day_1: "",
              day_2: "",
              day_3: "",
              day_4: "",
              day_5: "",
              day_6: "",
              day_7: "",
              day_8: "",
              day_9: "",
            }
          : res?.data?.user
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "An error occurred while fetching data."
      );
    }
  };

  const handleDateChange = (date, day) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null;

    setFindUser((prevFindUser) => ({
      ...prevFindUser,
      [day]: formattedDate,
    }));
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
    setIsSubmitting(true);
    try {
      const response = await postApi("assign-date-range", findUser);
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
      setIsSubmitting(false);
    }
  };

  console.log("selectedUser", selectedUser);
  console.log("findUser", findUser);
  const dayLabels = [
    "Day 1",
    "Day 2",
    "Day 3",
    "Day 4",
    "Day 5",
    "Day 6",
    "Day 7",
    "Day 8",
    "Day 9",
  ];

  return (
    <AdminLayout title={"Date range"}>
      <Helmet>
        <title>Date range assign</title>
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
          {dayLabels.map((label, index) => (
            <Grid item xs={12} md={4} key={index}>
              <h4>{label}</h4>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={findUser && dayjs(findUser[`day_${index + 1}`])}
                    onChange={(date) =>
                      handleDateChange(date, `day_${index + 1}`)
                    }
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
          ))}
          <Grid item xs={12}>
            <Button
              fullWidth
              onClick={handleSubmit}
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <BeatLoader color="#ff0000" /> : "Submit"}
            </Button>
          </Grid>
        </Grid>
      )}
    </AdminLayout>
  );
};

export default DateRange;
