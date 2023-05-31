import { useState,useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaPlus, FaMinus, FaTrash, FaEdit } from "react-icons/fa";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import {  InputLabel, Select } from "@mui/material";
import http from "../../utils/http";
import "../../styles/loader.css"
const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [temp, setTemp] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

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

  // useEffect(() => {
  //   // Perform necessary reload actions here
  //   console.log("Component reloaded");
  // }, []);

  const handleAddProduct = (event) => {
    event.preventDefault();
    http
      .post('/inventory/add', {
        itemName: event.target.name.value,
        itemType: event.target.type.value,
        itemDescription: event.target.description.value,
        quantity: event.target.quantity.value,
        expDate: event.target.expDate.value,
      })
      .then((res) => {
        console.log(res);
        Swal.fire({
          title: 'Success',
          text: 'Product added to inventory',
          icon: 'success',
          timer: 700, // Show the alert for 2 seconds
          showConfirmButton: false
        });
        getProducts(); // Refresh the products list
      })
      .catch((err) => console.log(err));
    event.target.reset();
  };
  

  const handleDeleteProduct = (_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        http
          .delete(`/inventory/delete/${_id}`)
          .then((res) => {
            console.log(res);
            Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
            getProducts(); // Refresh the products list
          })
          .catch((err) => console.log(err));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your product is safe :)', 'error');
      }
    });
  };
  
  const handleEditProduct = (params, event) => {
    const { id, field, props } = params;
    const { value } = event.target;
    const newProducts = products.map((product) => {
      if (product.id === id) {
        return { ...product, [field]: value };
      }
      return product;
    });
    setProducts(newProducts);
  };

  const handleQuantityChange = (index, amount) => {
    const newProducts = [...products];
    const product = newProducts[index];
    product.quantity = Math.max(parseInt(product.quantity) + amount, 0);
    setProducts(newProducts);
  };

  const handleEditDialogOpen = (product) => {
    setEditProduct(product);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditDialogSave = () => {
    const editedProduct = {
      itemName: document.getElementById("editName").value,
      itemType: document.getElementById("editType").value,
      itemDescription: document.getElementById("editDescription").value,
      quantity: document.getElementById("editQuantity").value,
      expDate: document.getElementById("editExpDate").value,
    };
  
    http
      .put(`/inventory/edit/${editProduct._id}`, editedProduct)
      .then((res) => {
        console.log(res);
        const updatedProducts = products.map((product) =>
          product._id === editProduct._id ? { ...product, ...editedProduct } : product
        );
        setProducts(updatedProducts);
        setEditDialogOpen(false);
        Swal.fire('Success', 'Product updated successfully!', 'success');
      })
      .catch((err) => console.log(err));
  };
  
  

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);

  if (isLoading) {
    return <div className="loader-overlay1">
    <h1>Loading...</h1>
    <div className="loader1"></div>
  </div> // Render the loader while loading
  }

  return (
    <Box m="20px" width="80%" margin="0 auto" className="reload-animation">
      <Header
        title="INVENTORY"
        subtitle="Inventory for medicines"
        fontSize="36px"
        mt="20px"
      />
      <Form onSubmit={handleAddProduct}>
           <Box marginBottom="10px">
               <InputLabel >Medicine</InputLabel>
             <TextField
                    placeholder="Input item name..."
                    name="name"
                    variant="filled"
                    fullWidth
                    required
                  />
           </Box>

           <Box marginBottom="10px">
               <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    native
                    fullWidth
                    required
                    variant="filled"
                  >
                    <option value="">Select Type of medecine</option>
                    <option value="Diazepam">Diazepam</option>
                    <option value="Meloxicam">Meloxicam</option>
                    <option value="Doxycycline">Doxycycline</option>
                    <option value="Ivermectin">Ivermectin</option>
                    <option value="Methimazole">Methimazole</option>
                    <option value="Enrofloxacin">Enrofloxacin</option>
                  </Select>
                </Box>

                <Box marginBottom="10px">
                  <InputLabel>Description</InputLabel>
                  <TextField
                    placeholder="Input Description"
                    name="description"
                    variant="filled"
                    fullWidth
                    required
                  />
                </Box>

                <Box marginBottom="10px">
                <InputLabel>Quantity</InputLabel>
                <TextField
                    placeholder="Input Quantity"
                    name="quantity"
                    type="number"
                    variant="filled"
                    fullWidth
                    required
                  />
                  </Box>

                  <Box marginBottom="10px">
                <InputLabel>Expiration Date</InputLabel>

                   <TextField
                    placeholder="Expiration Date"
                    name="expDate"
                    type="date"
                    variant="filled"
                    fullWidth
                    required
                  />
                  </Box>
        <div className="d-grid gap-2" style={{marginTop:"-20px", marginBottom: "20px"}}>
          <Button type="submit" className="btnDashBoard">
            <FaPlus /> Add Product
          </Button>
        </div>
      </Form>

      <Box
        m="40px 0 0 0"
        height="75vh"
        margin= "0 auto"
        sx={{
         
          // Styling for the DataGrid
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.greenAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.greenAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
        className="table"
          rows={products}
          columns={[
            { field: "id", headerName: "#", flex: 0.5 },
            { field: "itemName", headerName: "Name", flex: 1 },
            { field: "itemType", headerName: "Type", flex: 1 },
            { field: "itemDescription", headerName: "Description", flex: 1 },
            {
              field: "quantity",
              headerName: "Quantity",
              type: "number",
              headerAlign: "left",
              align: "left",
              flex: 1,
            },
            { field: "expDate", headerName: "Expiration Date", flex: 1 },
            {
              field: "actions",
              headerName: "Actions",
              align:"center",
              sortable: false,
              filterable: false,
              renderCell: (params) => (
                <div>
                  <Button
                  className="mx-1"
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteProduct(params.row._id)}
                  >
                    <FaTrash />
                  </Button>
                  <Button
                    size="sm"
                 
                    variant="primary"
                    onClick={() => handleEditDialogOpen(params.row)}
                  >
                    <FaEdit />
                  </Button>
                </div>
              ),
              flex:0.5,
            },
          ]}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
      <DialogTitle>Edit Product</DialogTitle>
<DialogContent>
  <Form onSubmit={handleEditProduct} >
    <Form.Group className="mb-3" controlId="editName">
      <Form.Label>Name</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter product name"
        defaultValue={editProduct ? editProduct.itemName : ""}
        required
      />
    </Form.Group>

    <Form.Group className="mb-3" controlId="editType">
    <Form.Label>Type of medicines</Form.Label>
    <Form.Control as="select" defaultValue={editProduct ? editProduct.itemType : ""} required>
      <option value="">Select a medicine</option>
      <option value="Diazepam">Diazepam </option>
      <option value="Meloxicam">Meloxicam</option>
      <option value="Doxycycline">Doxycycline</option>
      <option value="Ivermectin">Ivermectin</option>
      <option value="Methimazole">Methimazole</option>
      <option value="Enrofloxacin">Enrofloxacin</option>
    </Form.Control>
  </Form.Group>

    <Form.Group className="mb-3" controlId="editDescription">
      <Form.Label>Description</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter product description"
        defaultValue={editProduct ? editProduct.itemDescription : ""}
        required
      />
    </Form.Group>

    <Form.Group className="mb-3" controlId="editQuantity">
      <Form.Label>Quantity</Form.Label>
      <Form.Control
        type="number"
        placeholder="Enter product quantity"
        defaultValue={editProduct ? editProduct.quantity : ""}
        min="0"
        step="1"
        required
      />
    </Form.Group>

    <Form.Group className="mb-3" controlId="editExpDate">
      <Form.Label>Expiration Date</Form.Label>
      <Form.Control
        type="date"
        defaultValue={editProduct ? editProduct.expDate : ""}
        required
      />
    </Form.Group>
  </Form>
</DialogContent>
<DialogActions>
  <Button variant="warning" onClick={handleEditDialogClose}>
    Cancel
  </Button>
  <Button variant="danger" onClick={handleEditDialogSave} type="submit">
    Save
  </Button>
</DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;