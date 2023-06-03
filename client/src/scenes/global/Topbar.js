import { Box, IconButton, useTheme, Menu, MenuItem, Badge, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from "@mui/material";
import { useContext, useState,useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import "../../styles/topbar.css"
import http from "../../utils/http";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(1); // Update the notification count based on your logic
  const [products, setProducts] = useState([]);

  const getProducts = () => {
    http.get('/inventory/view')
        .then((res) => {
          const products = res.data.map((product, key) => ({
            id: key+1,
            _id: product._id,
            expDate: product.expDate,
            itemDescription: product.itemDescription,
            itemName: product.itemName,
            itemType: product.itemType,
            quantity: product.quantity,
          }));
          setProducts(products);
        })
        .catch((err) => console.log(err));
  }

  useEffect(() => {
    getProducts();
  },[])

  const userProfile = {
    username: "janwryMock",
    name: "Janwry DelaCruz",
    email: "janwry@mock.com",
    contact: "1234567890",
    role: "Admin",
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setIsNotificationOpen(true);
    setAnchorEl(event.currentTarget);
    setNotificationCount(0); // Reset the notification count when clicked
  };

  const handleNotificationClose = () => {
    setIsNotificationOpen(false);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setIsLoading(true); // Show the loader
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location = "/login";
    }, 1500);
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
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={handleNotificationClick}>
          <Badge badgeContent={notificationCount} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton onClick={handleMenuOpen}>
          <PersonOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          {isLoading && (
            <div className="loader-overlayLogout">
              <div className="loaderLogout"></div>
            </div>
          )}
        </Menu>
        <Menu
          anchorEl={anchorEl}
          open={isNotificationOpen}
          onClose={handleNotificationClose}
        >
           <h5 className="notification-title">Notifications</h5>
          <MenuItem>New item added on inventory</MenuItem>
          <MenuItem>New added animal record</MenuItem>
          <MenuItem>New added mortality report</MenuItem>
          <MenuItem>New added observation report</MenuItem>
          <MenuItem>New added medical history record</MenuItem>
        </Menu>
      </Box>

      {/* PROFILE DIALOG */}
      <Dialog open={isProfileDialogOpen} onClose={handleCloseProfileDialog}>
        <DialogTitle>Profile</DialogTitle>
        <DialogContent>
          <Box>
            <Typography variant="subtitle1">Username:</Typography>
            <TextField
              value={userProfile.username}
              fullWidth
              variant="outlined"
              disabled
            />
          </Box>
          <Box>
            <Typography variant="subtitle1">Name:</Typography>
            <TextField
              value={userProfile.name}
              fullWidth
              variant="outlined"
              disabled
            />
          </Box>
          <Box>
            <Typography variant="subtitle1">Email:</Typography>
            <TextField
              value={userProfile.email}
              fullWidth
              variant="outlined"
              disabled
            />
          </Box>
          <Box>
            <Typography variant="subtitle1">Contact:</Typography>
            <TextField
              value={userProfile.contact}
              fullWidth
              variant="outlined"
              disabled
            />
          </Box>
          <Box>
            <Typography variant="subtitle1">Role:</Typography>
            <TextField
              value={userProfile.role}
              fullWidth
              variant="outlined"
              disabled
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="warning" onClick={handleCloseProfileDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Topbar;
