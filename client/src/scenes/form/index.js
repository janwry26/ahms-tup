import React from "react";
import { Box, TextField, Select, MenuItem } from "@mui/material";
import { Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import "../../styles/loader.css";
// For API
import http from "../../utils/http";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values, { resetForm }) => {
    console.log(values);
    http
      .post("/user/register", values)     
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "User Created",
            text: "The user has been successfully created.",
          });
          resetForm(); // Reset the form after successful submission
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response.data,
        });
      });
  };

  const phoneRegExp = /^0[0-9]{10}$/;


  const checkoutSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    contact: yup
      .string()
      .matches(phoneRegExp, "Contact number must start with 09 and have 11 digits")
      .required("Contact Number is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
    username: yup
      .string()
      .required("Username is required")
      .min(8, "Username must be at least 8 characters long"),
    role: yup.string().required("Role is required"),
  });

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    username: "",
    role: "",
  };

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);

  if (isLoading) {
    return (
      <div className="loader-overlay1">
        <div className="loader1"></div>
      </div>
    ); // Render the loader while loading
  }

  return (
    <Box m="20px" width="98%" sx={{ margin: "0 auto" }}>
      <Header title="CREATE USER" subtitle="Create a new user profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              background="white"
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
             <TextField
              fullWidth
              variant="filled"
              type="text"
              label="First Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.firstName}
              name="firstName"
              error={!!touched.firstName && !!errors.firstName}
              helpertext={touched.firstName && errors.firstName} // Updated prop name
              sx={{ gridColumn: "span 2" }}
            />

          <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    values.password = e.target.value; // Update the password field value
                    values.confirmPassword = e.target.value; // Update the confirm password field value
                  }}
                  value={values.lastName}
                  name="lastName"
                  error={!!touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helpertext={touched.username && errors.username}
                sx={{ gridColumn: "span 2" }}
              />
                 <Select
                fullWidth
                variant="filled"
                label="Role"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.role}
                name="role"
                error={!!touched.role && !!errors.role}
                helpertext={touched.role && errors.role}
                sx={{ gridColumn: "span 2" }}
                displayEmpty
              >
                <MenuItem value="" disabled>Select Role</MenuItem>
                <MenuItem value="Zookeeper">Zookeeper</MenuItem>
                <MenuItem value="Veterinarian">Veterinarian</MenuItem>
                <MenuItem value="Zoologist">Zoologist</MenuItem>
                <MenuItem value="Foreman">Foreman</MenuItem>
              </Select>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helpertext={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Contact Number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.contact}
              name="contact"
              error={!!touched.contact && !!errors.contact}
              helperText={touched.contact && errors.contact}
              sx={{ gridColumn: "span 4" }}
            />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helpertext={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Confirm Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPassword}
                name="confirmPassword"
                error={!!touched.confirmPassword && !!errors.confirmPassword}
                helpertext={touched.confirmPassword && errors.confirmPassword}
                sx={{ gridColumn: "span 4" }}
              />
           

              <div
                className="d-grid gap-2"
                style={{ marginTop: "-20px", marginBottom: "20px" }}
              >
                <Button type="submit" className="btnDashBoard" disabled={isSubmitting}>
                  Create User
                </Button>
              </div>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;
