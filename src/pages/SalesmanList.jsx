import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminLayout/AdminLayout";
import { Box, Button, Chip, Grid, IconButton, TextField } from "@mui/material";
import DataTable from "../components/DataTable/DataTable";
import { MoreHoriz } from "@mui/icons-material";
import Dropdownmenu from "../components/Dropdown/DropdownMenu";
import { getApi, postApi, putApi } from "../config/configAxios";
import CustomLoader from "../components/customLoader/CustomLoader";
import axios from "axios";
import TransitionsModal from "../components/Modal";
import * as Yup from "yup";

import { toast } from "react-toastify";
import { useFormik } from "formik";

const SalesmanList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [salesman, setSalesman] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const handleMenuOpen = (event, itemId) => {
    setAnchorEl(event.currentTarget);
    setItemId(itemId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const fetchData = async () => {
    try {
      const response = await getApi("users");
      setSalesman(response.data.users);
    } catch (error) {
      console.log("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // handle action
  const handleAction = async (actionType) => {
    setLoading(true);
    try {
      switch (actionType) {
        case "delete":
          await axios.delete(`delete-user/${itemId}`);
          toast.success("Salesman has been deleted");
          break;
        default:
          await putApi(`status-user/${itemId}`, { status: actionType });
          toast.success("Salesman status has been updated");
      }
      fetchData();
    } catch (error) {
      console.error("An error occurred while updating status.", error);
    } finally {
      handleMenuClose();
      setLoading(false);
    }
  };

  const actionItems = [
    { type: "active" },
    { type: "disabled" },
    { type: "delete" },
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const status = params.row.status.toLowerCase(); // Convert status to lowercase

        if (status === "active") {
          return <Chip size="small" label={status} color="success" />;
        } else if (status === "disabled") {
          // Use "else if" instead of just "else"
          return <Chip size="small" label={status} color="info" />;
        } else {
          return null; // Handle other status values if needed
        }
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 60,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex">
          <IconButton
            onClick={(event) => handleMenuOpen(event, params.row.itemId)}
          >
            <MoreHoriz />
          </IconButton>
          <Dropdownmenu
            anchorEl={anchorEl}
            handleMenuClose={handleMenuClose}
            handleAction={handleAction}
            actionItems={actionItems}
          />
        </Box>
      ),
    },
    // Add more columns as needed
  ];

  useEffect(() => {
    // Update the 'data' array when 'properties' state changes
    const newData = salesman
      .filter((data) => data.role !== "admin")
      .map((data, index) => ({
        itemId: data.id,
        id: index + 1,
        username: data.name || "",
        email: data.email || "",
        status: data.status || "Active",
      }));

    setData(newData);
  }, [salesman]);

  // handle file submit

  const initialValues = {
    name: "",
    email: "",
    password: "",
    number: "",
  };

  const salesmanSchema = Yup.object({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(40, "Too Long!")
      .required("Name is required"),
    number: Yup.number().required("Number is required"),
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must have at least 6 characters"),
    // .matches(/[0-9]/, "Must have a number")
    // .matches(/[a-z]/, "Must have at least one lowercase")
    // .matches(/[A-Z]/, "Must have at least one uppercase")
    // .matches(/[!@#%^&*]/, "Must have at least one special character")
    confirmPassword: Yup.string()
      .required("Must have a confirm password")
      .oneOf([Yup.ref("password"), null], "Password does not match"),
  });

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: salesmanSchema,

    onSubmit: async (values, action) => {
      try {
        setSubmitting(true);
        const formData = {
          name: values.name,
          password: values.password,
          number: values.number,
          email: values.email,
        };
        const response = await postApi("/add-user", formData);

        if (response.status === 200) {
          fetchData();
          setOpen(false);
          toast.success("User uploaded successfully");
          setSubmitting(false);
          action.resetForm();
        }
      } catch (error) {
        setSubmitting(false);
      }
    },
  });

  const handleOpen = () => setOpen(true);

  return (
    <AdminLayout title={"Salesman List"}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            sx={{ textTransform: "capitalize" }}
            onClick={handleOpen}
          >
            Add Salesman
          </Button>
          <TransitionsModal
            title={"Add user"}
            handleSubmit={handleSubmit}
            open={open}
            setOpen={setOpen}
            isSubmitting={isSubmitting}
          >
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={errors.name && errors.name}
                    helperText={errors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={errors.email && errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={errors.password && errors.password}
                    helperText={errors.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="confirmPassword"
                    label="confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={values.confirmPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={errors.confirmPassword && errors.confirmPassword}
                    helperText={errors.confirmPassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="number"
                    label="Number"
                    name="number"
                    value={values.number}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={errors.number && errors.number}
                    helperText={errors.number}
                  />
                </Grid>
              </Grid>
            </form>
          </TransitionsModal>
          {loading ? (
            <CustomLoader />
          ) : (
            <DataTable data={data} columns={columns} />
          )}
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default SalesmanList;
