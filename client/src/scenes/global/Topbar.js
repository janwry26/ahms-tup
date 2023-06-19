import { Box, IconButton, useTheme, Menu, MenuItem, Badge, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { format } from "date-fns";
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
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [products, setProducts] = useState([]);

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
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getCurrentUser();
    getProducts();
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

  const handleNotificationsOpen = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorElNotifications(null);
  };

  const handleViewProfile = () => {
    setIsProfileDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseProfileDialog = () => {
    setIsProfileDialogOpen(false);
  };

  const getProducts = () => {
    http.get('/inventory/view')
      .then((res) => {
        const products = res.data.map((product, key) => ({
          id: key + 1,
          _id: product._id,
          category: product.category,
          unitOfMeasure: product.unitOfMeasure,
          manufacturer: product.manufacturer,
          supplier: product.supplier,
          dateAdded: format(new Date(product.dateAdded), "MMMM d, yyyy"),
          expDate: format(new Date(product.expDate), "MMMM d, yyyy"),
          itemDescription: product.itemDescription,
          itemName: product.itemName,
          itemType: product.itemType,
          quantity: product.quantity,
        }));

        const sortedProductsByQuantity = [...products].sort((a, b) => a.quantity - b.quantity);
        const sortedProductsByExpirationDate = [...products].sort((a, b) => new Date(a.expDate) - new Date(b.expDate));

        const leastQuantityProducts = sortedProductsByQuantity.slice(0, 5);
        const soonestExpirationProducts = sortedProductsByExpirationDate.slice(0, 5);

        const notificationItems = leastQuantityProducts.map((product) => ({
          id: product.id,
          itemName: product.itemName,
          quantity: product.quantity,
          expDate: product.expDate,
        }));

        setProducts(notificationItems.concat(soonestExpirationProducts));
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px"></Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={handleNotificationsOpen}>
          <Badge badgeContent={products.length} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorElNotifications}
          open={Boolean(anchorElNotifications)}
          onClose={handleNotificationsClose}
          className="notification-menu"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          getContentAnchorEl={null}
        >
          {products.map((product) => (
            <MenuItem key={product.id}>
              <Box display="flex" flexDirection="column">
                <Typography variant="body1" color="textPrimary">{product.itemName}</Typography>
                <Typography variant="body2" color="textSecondary">{`Quantity: ${product.quantity}`}</Typography>
                <Typography variant="body2" color="textSecondary">{`Expiration Date: ${product.expDate}`}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        <IconButton onClick={handleMenuOpen}>
          <PersonOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorElProfile}
          open={Boolean(anchorElProfile)}
          onClose={handleMenuClose}
          className="profile-menu"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          getContentAnchorEl={null}
        >
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
