import { Box, IconButton, useTheme, Menu, MenuItem, Badge, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import "../../styles/topbar.css";
import http from "../../utils/http";
import jwtDecode from 'jwt-decode';

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    setCurrentUser(decoded);
    console.log(decoded);
    if (decoded.username === "Admin" || decoded.username === "Super Admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const storedItems = localStorage.getItem("notificationItems");
      if (storedItems) {
        setProducts(JSON.parse(storedItems));
        setNotificationCount(JSON.parse(storedItems).length);
      } else {
        getProducts();
      }
    } else {
      const storedRemovedItems = localStorage.getItem("removedNotificationItems");
      const storedItems = localStorage.getItem("notificationItems");
      if (storedItems) {
        setProducts(JSON.parse(storedItems));
        setNotificationCount(JSON.parse(storedItems).length);
      } else if (storedRemovedItems) {
        const removedItems = JSON.parse(storedRemovedItems);
        setProducts(removedItems);
        setNotificationCount(removedItems.length);
      } else {
        setProducts([]);
        setNotificationCount(0);
      }
    }
  }, [localStorage.getItem("token")]);

  const getProducts = () => {
    http.get('/inventory/view')
      .then((res) => {
        const newProducts = res.data.map((product, key) => ({
          id: key + 1,
          _id: product._id,
          expDate: product.expDate,
          itemDescription: product.itemDescription,
          itemName: product.itemName,
          itemType: product.itemType,
          quantity: product.quantity,
        }));
        setProducts(newProducts);
        setNotificationCount(newProducts.length);
        localStorage.setItem("notificationItems", JSON.stringify(newProducts));
      })
      .catch((err) => console.log(err));
  };

  const handleRemoveItem = (itemId) => {
    // Remove the item from the products array
    const updatedProducts = products.filter((product) => product.id !== itemId);
    setProducts(updatedProducts);
    setNotificationCount(updatedProducts.length);
    // Update notification items in local storage only if the user is logged in
    if (localStorage.getItem("token")) {
      localStorage.setItem("notificationItems", JSON.stringify(updatedProducts));
    } else {
      // If the user is not logged in, store the removed items separately
      const removedItems = JSON.parse(localStorage.getItem("removedNotificationItems")) || [];
      const removedItem = products.find((product) => product.id === itemId);
      removedItems.push(removedItem);
      localStorage.setItem("removedNotificationItems", JSON.stringify(removedItems));
    }
  };

  const handleLogout = () => {
    setIsLoading(true);
    localStorage.removeItem("token");
    // Clear notification items in local storage
    localStorage.removeItem("notificationItems");
    localStorage.removeItem("removedNotificationItems"); // Remove removed items when logging out
    setProducts([]); // Clear the products array
    setNotificationCount(0); // Reset the notification count
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

  const handleNotificationClick = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorElNotification(null);
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
        <IconButton onClick={handleNotificationClick}>
          <Badge badgeContent={notificationCount} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
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
        <Menu anchorEl={anchorElNotification} open={Boolean(anchorElNotification)} onClose={handleNotificationClose}>
          <h5 className="notification-title">Notifications</h5>
          {products.map((product) => (
            <MenuItem key={product.id}>
              {product.itemName} added to inventory
              <IconButton size="small" onClick={() => handleRemoveItem(product.id)}>
                <ClearIcon />
              </IconButton>
            </MenuItem>
          ))}
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
          {currentUser && (
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
          {currentUser && (
            <Box>
              <Typography variant="subtitle1">Contact:</Typography>
              <TextField value={currentUser.contactNum} fullWidth variant="outlined" disabled />
            </Box>
          )}
          {isAdmin && (
            <Box>
              <Typography variant="subtitle1">Acc Type:</Typography>
              <TextField value={isAdmin.accType} fullWidth variant="outlined" disabled />
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