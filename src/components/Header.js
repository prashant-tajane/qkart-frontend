import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons, showUserDetails }) => {
  const history = useHistory();

  const goToProducts = () => {
    history.push("/");
  };

  const goToLogin = () => {
    history.push("/login");
  };

  const goToRegister = () => {
    history.push("/register");
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      {hasHiddenAuthButtons ? (
        showUserDetails ? (
          <Stack
            direction="row"
            spacing={2}
            className="header-username-container"
          >
            {/* <img src="avtar.png" alt={localStorage.getItem("username")} /> */}
            <Avatar alt={localStorage.getItem("username")} src="avatar.png" />
            <div className="logged-user">
              {localStorage.getItem("username")}
            </div>
            <Button onClick={handleLogout}>LOGOUT</Button>
          </Stack>
        ) : (
          <Button
            onClick={goToProducts}
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
          >
            Back to explore
          </Button>
        )
      ) : (
        <Stack direction="row" spacing={2}>
          <Button onClick={goToLogin} className="login-button">
            Login
          </Button>
          <Button onClick={goToRegister} className="register-button">
            Register
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
