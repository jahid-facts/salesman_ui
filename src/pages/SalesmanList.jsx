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
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

import { toast } from "react-toastify";
import { useFormik } from "formik";

const SalesmanList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [salesman, setSalesman] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [userEdit, setUserEdit] = useState(false);

  // updated password
  const [openEditPassword, setOpenEditPassword] = useState(false);
  const [updatePassword, setUpdatePassword] = useState("");
  const [loadingEditPassword, setLoadingEditPassword] = useState(false);

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
    try {
      switch (actionType) {
        case "delete":
          Swal.fire({
            title: "Confirm delete ?",
            text: "Are you sure you want to delete this user?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                await axios
                  .delete(
                    `${process.env.REACT_APP_API_BASE_URL}delete-user/${itemId}`
                  )
                  .then((res) => {
                    toast.success(res.data?.message);
                  })
                  .catch((err) => {
                    toast.error("An error occurred while deleting status");
                  })
                  .finally(() => {
                    fetchData();
                  });
              } catch (error) {
                Swal.fire(
                  "Error",
                  "An error occurred while delete the user.",
                  "error"
                );
              }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire("Cancelled", "The user was not deleted.", "info");
            }
          });
          break;
        case "empty_deviceId":
          Swal.fire({
            title: "Confirm empty device id",
            text: "Are you sure you want to active this empty device id?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, empty it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                await axios
                  .post(
                    `${process.env.REACT_APP_API_BASE_URL}empty-deviceId-user/${itemId}`
                  )
                  .then((res) => {
                    toast.success(res.data?.message);
                  })
                  .catch((err) => {
                    toast.error("An error occurred while updating status");
                  })
                  .finally(() => {
                    fetchData();
                  });
              } catch (error) {
                Swal.fire(
                  "Error",
                  "An error occurred while  empty device id the user.",
                  "error"
                );
              }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                "Cancelled",
                "The user device id was not empty.",
                "info"
              );
            }
          });

          break;
        case "edit":
          try {
            await axios
              .get(`${process.env.REACT_APP_API_BASE_URL}users/${itemId}`)
              .then((res) => {
                setUserEdit(res?.data?.user);
                setOpenEdit(true);
              })
              .catch((err) => {
                toast.error("An error occurred while updating status");
              });
          } catch (error) {
            Swal.fire(
              "Error",
              "An error occurred while  empty device id the shop.",
              "error"
            );
          }

          break;
        case "password":
          setOpenEditPassword(true);

          break;
        default:
          await putApi(`status-user/${itemId}`, { status: actionType });
          toast.success("Salesman status has been updated");
      }
    } catch (error) {
      console.error("An error occurred while updating status.", error);
    } finally {
      fetchData();
      handleMenuClose();
    }
  };

  const actionItems = [
    { type: "empty_deviceId" },
    { type: "edit" },
    { type: "password" },
    { type: "active" },
    { type: "disabled" },
    { type: "delete" },
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "deviceId", headerName: "Device Id", width: 150 },
    { field: "number", headerName: "Number", width: 200 },
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
        deviceId: data?.deviceId || "",
        number: data?.number || "",
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
        await postApi("/add-user", formData)
          .then((res) => {
            fetchData();
            setOpen(false);
            toast.success("User uploaded successfully");
            setSubmitting(false);
            action.resetForm();
          })
          .catch((err) => {
            toast.error(err?.response?.data[0] || "User uploaded failed");
          });
      } catch (error) {
        setSubmitting(false);
      }
    },
  });

  const handleOpen = () => setOpen(true);

  // edit user
  const [editLoading, setEditLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    number: "",
  });

  useEffect(() => {
    // Update userData when userEdit changes
    if (userEdit) {
      setUserData({
        name: userEdit.name || "",
        email: userEdit.email || "",
        number: userEdit.number || "",
      });
    }
  }, [userEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmitEdit = async () => {
    setEditLoading(true);

    try {
      const data = {
        name: userData.name,
        email: userData.email,
        number: userData.number,
      };

      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}update-user/${itemId}`,
        data
      );

      toast.success("User updated successfully");
      setOpenEdit(false);
      fetchData();
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setEditLoading(false);
    }
  };

  // update password
  const handleSubmitEditPassword = async () => {
    setLoadingEditPassword(true);
    if (updatePassword.length < 6) {
      toast.error("Password must have a minimum of 6 characters");
      setLoadingEditPassword(false);
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}update-user-password/${itemId}`,
        {
          password: updatePassword,
        }
      );

      toast.success("User password updated successfully");
      setOpenEditPassword(false);
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setLoadingEditPassword(false);
    }
  };
  return (
    <AdminLayout title={"Salesman List"}>
      <Helmet>
        <title>Salesman list</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            sx={{ textTransform: "capitalize", mb: 2 }}
            onClick={handleOpen}
          >
            Add Salesman
          </Button>
          {/* salesman edit  */}
          <TransitionsModal
            title={"Edit user"}
            handleSubmit={handleSubmitEdit}
            open={openEdit}
            setOpen={setOpenEdit}
            isSubmitting={editLoading}
          >
            <form onSubmit={handleSubmitEdit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="number"
                    label="Number"
                    name="number"
                    value={userData.number}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </form>
          </TransitionsModal>

          {/* password  */}
          <TransitionsModal
            title={"Update password"}
            handleSubmit={handleSubmitEditPassword}
            open={openEditPassword}
            setOpen={setOpenEditPassword}
            isSubmitting={loadingEditPassword}
          >
            <form onSubmit={handleSubmitEdit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="password"
                    label="Password Address"
                    name="passwordEdit"
                    value={updatePassword}
                    onChange={(e) => setUpdatePassword(e.target.value)}
                  />
                </Grid>
              </Grid>
            </form>
          </TransitionsModal>

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
