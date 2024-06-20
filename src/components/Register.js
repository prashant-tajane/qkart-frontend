import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import { useHistory, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [apiProgress, setApiProgress] = useState(false);

  const handleChange = (e) => {
    setLoginData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    const URL = `${config.endpoint}/auth/register`;
    try {
      const res = await axios.post(URL, formData);
      if (res.status === 201)
        enqueueSnackbar("Registered successfully", { variant: "success" });
      setLoginData({
        username: "",
        password: "",
        confirmPassword: "",
      });
      setApiProgress((prevValue) => !prevValue); //false
      history.push("/login");
    } catch (error) {
      if (error.response?.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
      setApiProgress((prevValue) => !prevValue); //false
    }
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    const payload = {
      username: loginData.username,
      password: loginData.password,
    };
    await register(payload);
  };

  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data, event) => {
    event.preventDefault();
    if (!data.username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return;
    }
    if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "warning",
      });
      return;
    }

    if (!data.password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return;
    }
    if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
      return;
    }
    if (!data.confirmPassword) {
      enqueueSnackbar("Confirm password is a required field", {
        variant: "warning",
      });
      return;
    }

    if (data.password.length !== data.confirmPassword.length) {
      enqueueSnackbar("Passwords do not match", {
        variant: "warning",
      });
      return;
    }
    setApiProgress((prevValue) => !prevValue); // true
    handleSubmit();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={true} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={loginData.username}
            onChange={handleChange}
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={loginData.password}
            onChange={handleChange}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={loginData.confirmPassword}
            onChange={handleChange}
            type="password"
            fullWidth
          />
          {apiProgress ? (
            <div className="circular-progress-div">
              <CircularProgress className="circular-progress" />
            </div>
          ) : (
            <Button
              onClick={(event) => validateInput(loginData, event)}
              className="button"
              variant="contained"
            >
              Register Now
            </Button>
          )}

          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
