import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  TextField,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import { BeatLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux"; 
import { clearMessage, loginUser } from "../../redux/features/AuthSlice";
import logo from "../../assets/Bengal.png";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { error, success } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const userSchema = Yup.object({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must have at least 6 characters"),
  });

  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: userSchema,

    onSubmit: async (values, action) => {
      try {
        setSubmitting(true);

        const loginData = { email: values.email, password: values.password };
        // Dispatch the loginUser action
        await dispatch(loginUser(loginData));

        setSubmitting(false);
      } catch {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMessage());
    }
    if (success) {
      toast.success(success);
      navigate("/");
      dispatch(clearMessage());
    }
  }, [error, success, dispatch, navigate]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor={"#e7e7e7"}
    >
      <Box p={2}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100%"
            >
              <Box>
                <Link to={"/"}>
                  <img
                    src={logo}
                    alt="Airbnb Logo"
                    style={{
                      height: "100px",
                      cursor: "pointer",
                      // border: "1px solid #f3f3f3",
                    }}
                  />
                </Link>
                <Box p={1}>
                  <p>Bengal Trading (M) SDN. BHD.</p>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              boxShadow={"0px 0px 18px 0px #6363633b"}
              p={4}
              textAlign={"center"}
              xs={{
                width: "100%",
              }}
              borderRadius={"20px"}
              bgcolor={"#fafcfe"}
            >
              <h1>Sign In</h1>
              <div style={{ textAlign: "left", width: "100%" }}>
                <h2>Welcome ! 👋🏻</h2>
                <p>Please sign-in to your account and start the adventure</p>
              </div>
              <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Box pt={2}>
                  <TextField
                    type="email"
                    label="Email"
                    fullWidth
                    name="email"
                    error={!!errors.email && touched.email}
                    autoComplete="current-email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email && (
                    <p
                      style={{
                        color: "#d32f2f",
                        textAlign: "left",
                        margin: 0,
                        fontSize: "13px",
                        paddingTop: "10px",
                      }}
                    >
                      {errors.email}
                    </p>
                  )}
                </Box>
                <Box py={3}>
                  <FormControl sx={{ width: "100%" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      error={!!errors.password && touched.password}
                      name="password"
                      autoComplete="current-password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                  {errors.password && touched.password && (
                    <p
                      style={{
                        color: "#d32f2f",
                        textAlign: "left",
                        margin: 0,
                        fontSize: "13px",
                        paddingTop: "10px",
                      }}
                    >
                      {errors.password}
                    </p>
                  )}
                </Box>
                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                  color="secondary"
                  sx={{ textTransform: "capitalize", mt: 2, color: "#fff" }}
                >
                  {isSubmitting ? <BeatLoader color="#ff0000" /> : "Login"}
                </Button>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginScreen;
