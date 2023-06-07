import { Box, IconButton, useTheme, Menu, MenuItem, Badge, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import "../../styles/topbar.css";
import http from "../../utils/http";
import jwtDecode from 'jwt-decode';

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [anchorElProfile, setAnchorElProfile] = useState(null);

  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    setCurrentUser(decoded);
    if (decoded.username === "Admin" || decoded.username === "Super Admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      http.get(`/user/view-email/${decoded.email}`)
        .then((res) => {
          setCurrentUser(res.data);
        })
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);


  const handleLogout = () => {
    setIsLoading(true);
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location = "/login";
    }, 1500);
  };

  const handleMenuOpen = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElProfile(null);
  };

 

  const handleViewProfile = () => {
    setIsProfileDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseProfileDialog = () => {
    setIsProfileDialogOpen(false);
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px"></Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={handleMenuOpen}>
          <PersonOutlinedIcon />
        </IconButton>
        <Menu anchorEl={anchorElProfile} open={Boolean(anchorElProfile)} onClose={handleMenuClose}>
          <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          {isLoading && (
            <div className="loader-overlayLogout">
              <div className="loaderLogout"></div>
            </div>
          )}
        </Menu>
       
      </Box>

      {/* PROFILE DIALOG */}
      <Dialog open={isProfileDialogOpen} onClose={handleCloseProfileDialog}>
        <DialogTitle>Profile</DialogTitle>
        <DialogContent>
          <Box>
            <Typography variant="subtitle1">Username:</Typography>
            <TextField value={currentUser.username} fullWidth variant="outlined" disabled />
          </Box>
          {!isAdmin && (
            <Box>
              <Typography variant="subtitle1">Name:</Typography>
              <TextField
                value={`${currentUser.firstName}, ${currentUser.lastName}  `}
                fullWidth
                variant="outlined"
                disabled
              />
            </Box>
          )}
          <Box>
            <Typography variant="subtitle1">Email:</Typography>
            <TextField value={currentUser.email} fullWidth variant="outlined" disabled />
          </Box>
          {!isAdmin && (
            <Box>
              <Typography variant="subtitle1">Contact:</Typography>
              <TextField value={currentUser.contactNum} fullWidth variant="outlined" disabled />
            </Box>
          )}
          {isAdmin && (
            <Box>
              <Typography variant="subtitle1">Acc Type:</Typography>
              <TextField value={currentUser.username} fullWidth variant="outlined" disabled />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="warning" onClick={handleCloseProfileDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Topbar;