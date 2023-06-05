import { Box, IconButton, useTheme, Menu, MenuItem, Badge, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import "../../styles/topbar.css";
import http from "../../utils/http";
import jwtDecode from 'jwt-decode';

  const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

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
  }

  useEffect(()=> {
    getCurrentUser()
  },[])


  const getProducts = () => {
    http
      .get("/inventory/view")
      .then((res) => {
        const products = res.data.map((product, key) => ({
          id: key + 1,
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
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    setNotificationCount(products.length);
  }, [products]);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setIsNotificationOpen(true);
    setNotificationAnchorEl(event.currentTarget);
    setNotificationCount(0); // Reset the notification count when clicked
  };

  const handleNotificationClose = () => {
    setIsNotificationOpen(false);
    setNotificationAnchorEl(null);
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

  const handleRemoveItem = (itemId) => {
    // Remove the item from the products state based on its ID
    const updatedProducts = products.filter((product) => product.id !== itemId);
    setProducts(updatedProducts);
    localStorage.setItem("removedItems", JSON.stringify(updatedProducts)); // Store the updated products in local storage
  };

  const handleRemoveAllItems = () => {
    // Remove all items from the products state
    setProducts([]);
    localStorage.setItem("removedItems", "[]"); // Store an empty array in local storage to remove all items
  };

  // Load the removed items from local storage on component mount
  useEffect(() => {
    const removedItems = localStorage.getItem("removedItems");
    if (removedItems) {
      setProducts(JSON.parse(removedItems));
    }
  }, []);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        {/* Your search bar content */}
      </Box>

      {/* ICONS */}
      <Box display="flex" alignItems="center" ml={2}>
        <IconButton onClick={handleNotificationClick}>
          <Badge badgeContent={notificationCount} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton onClick={handleMenuOpen}>
          <PersonOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
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
          anchorEl={notificationAnchorEl}
          open={isNotificationOpen}
          onClose={handleNotificationClose}
          className="notification-menu"
         
        >
          <DialogTitle>Notifications</DialogTitle>
          <DialogContent>
            <div className="notification-items">
              {products.length === 0 ? (
                <Typography variant="body2" className="no-items-text">
                  No new items
                </Typography>
              ) : (
                products.map((product) => (
                  <div className="notification-item" key={product.id}>
                    <Box className="notification-layout">
                      <Typography variant="body3" className="item">{product.itemName}</Typography>
                      <Typography variant="body2" className="added-text">
                        Added to inventory
                      </Typography>
                      <IconButton
                        onClick={() => handleRemoveItem(product.id, product.itemName)}
                        className="remove-button"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
          {products.length > 0 && (
            <DialogActions>
              <Button onClick={handleRemoveAllItems} color="error">
                Remove All
              </Button>
            </DialogActions>
          )}
        </Menu>
      </Box>

      {/* PROFILE DIALOG */}
      <Dialog open={isProfileDialogOpen} onClose={handleCloseProfileDialog}>
        <DialogTitle>Profile</DialogTitle>
        <DialogContent>
          <Box>
            <Typography variant="subtitle1">Username:</Typography>
            <TextField
              value={currentUser.username}
              fullWidth
              variant="outlined"
              disabled
            />
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
            <TextField
              value={currentUser.email}
              fullWidth
              variant="outlined"
              disabled
            />
          </Box>
          {currentUser && (
          <Box>
            <Typography variant="subtitle1">Contact:</Typography>
            <TextField
              value={currentUser.contactNum}
              fullWidth
              variant="outlined"
              disabled
            />
          </Box>
          )}
           {isAdmin && (
          <Box>
            <Typography variant="subtitle1">Acc Type:</Typography>
            <TextField
              value={isAdmin.accType}
              fullWidth
              variant="outlined"
              disabled
            />
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
