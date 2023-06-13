import * as React from 'react';
import Modal from '@mui/material/Modal';
import { useState,useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaPlus, FaArchive, FaEdit } from "react-icons/fa";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import {  InputLabel, Select } from "@mui/material";
import { format } from "date-fns";
import http from "../../utils/http";
import "../../styles/loader.css"
import { formatDate } from "../../utils/formatDate";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  

  const getProducts = () => {
    http.get('/inventory/view')
        .then((res) => {
          const products = res.data.map((product, key) => ({
            id: key+1,
            _id: product._id,
            category: product.category,
            unitOfMeasure: product.unitOfMeasure,
            manufacturer: product.manufacturer,
            supplier:product.supplier,
            dateAdded: format(new Date(product.dateAdded), "MMMM d, yyyy"),
            expDate: format(new Date(product.expDate), "MMMM d, yyyy"),
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


  const handleAddProduct = (event) => {
    event.preventDefault();
    http
    .post('/inventory/add', {
      category: event.target.category.value,
      unitOfMeasure: event.target.unitOfMeasure.value,
      manufacturer: event.target.manufacturer.value,
      supplier: event.target.supplier.value,
      itemName: event.target.name.value,
      itemType: event.target.type.value,
      itemDescription: event.target.description.value,
      quantity: event.target.quantity.value,
      expDate: event.target.expDate.value,
      dateAdded: formatDate(event.target.dateAdded.value)
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
        handleClose();
      })
      .catch((err) => console.log(err));
    event.target.reset();
  };
  

  const handleDeleteProduct = (_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Your product will be archive',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, archive it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        http
          .put(`/inventory/archive/${_id}`)
          .then((res) => {
            console.log(res);
            Swal.fire('Archived!', 'Your product has been archived.', 'success');
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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'scroll',
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
      category:document.getElementById("editCategory").value,
      unitOfMeasure:document.getElementById("editUnitOfMeasure").value,
      manufacturer:document.getElementById("editManufacturer").value,
      supplier:document.getElementById("editSupplier").value,
      itemName: document.getElementById("editName").value,
      itemType: document.getElementById("editType").value,
      itemDescription: document.getElementById("editDescription").value,
      quantity: document.getElementById("editQuantity").value,
      expDate: document.getElementById("editExpDate").value,
      dateAdded: document.getElementById("editDateAdded").value,
    };
  
    http
      .put(`/inventory/edit/${editProduct._id}`, editedProduct)
      .then((res) => {
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
    <div className="loader1"></div>
  </div> // Render the loader while loading
  }

  return (
    <Box m="20px" width="98%" margin="0 auto" className="reload-animation">
      <Header
        title="INVENTORY"
        subtitle="Manage list of Inventory"
        fontSize="36px"
        mt="20px"
      />
      <Button onClick={handleOpen} className="btn btn-color" >Add Inventory</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
      <Form onSubmit={handleAddProduct}>

      <Box marginBottom="10px">
               <InputLabel>Category of Inventory</InputLabel>
                  <Select
                    name="category"
                    native
                    fullWidth
                    required
                    variant="filled"
                  >
                    <option value="">Select Category</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Food">Food</option>
                  </Select>
                </Box>
           <Box marginBottom="10px">
               <InputLabel >Item Name</InputLabel>
             <TextField
                    placeholder="Input item name..."
                    name="name"
                    variant="filled"
                    fullWidth
                    required
                  />
           </Box>
           <Box marginBottom="10px">
               <InputLabel>Item Type</InputLabel>
                  <Select
                    name="type"
                    native
                    fullWidth
                    required
                    variant="filled"
                  >
                    <option value="">Select Item Type</option>
                    <option value="Drops">Drops</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Animal Food">Animal Food</option>
                    <option value="Supply">Supply</option>
                  </Select>
                </Box>

                <Box marginBottom="10px">
               <InputLabel>Item Type</InputLabel>
                  <Select
                    name="unitOfMeasure"
                    native
                    fullWidth
                    required
                    variant="filled"
                  >
                    <option value="">Select Item Type</option>
                    <option value="pcs">pcs</option>
                    <option value="box">box</option>
                    <option value="rolls">rolls</option>
                    <option value="ampule">ampule</option>
                    <option value="set">set</option>
                    <option value="bot">bot</option>
                    <option value="vial">vial</option>
                    <option value="vials">vials</option>
                    <option value="can">can</option>
                   
                  </Select>
                </Box>
                <Box marginBottom="10px">
                <InputLabel>Manufacturer</InputLabel>
                  <Select
                    name="manufacturer"
                    native
                    fullWidth
                    required
                    variant="filled"
                  >
                    <option value="">Select Manufacturer</option>
                    <option value="Trenchant Trading Incorporated">Trenchant Trading Incorporated</option>
                  </Select>
                </Box>
                <Box marginBottom="10px">
                <InputLabel>Supplier</InputLabel>
                  <Select
                    name="supplier"
                    native
                    fullWidth
                    required
                    variant="filled"
                  >
                    <option value="">Select Supplier</option>
                    <option value="City General Services Office">City General Services Office</option>
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
                <InputLabel>Date Added</InputLabel>
                   <TextField
                    name="dateAdded"
                    type="date"
                    variant="filled"
                    fullWidth
                    required/>
                  </Box>
                  <Box marginBottom="10px">
                <InputLabel>Expiration Date</InputLabel>

                   <TextField
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
      </Box>
      </Modal>
      <Box
        m="40px 0 0 0"
        height="75vh"
        margin= "0 auto"
        sx={{
          // Styling for the DataGrid
          "& .MuiDataGrid-root": {
            fontSize: "16px",
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: "18px",
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
            fontSize: "18px",
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
        className="table"
          rows={products}
          columns={[
            { field: "category", headerName: "Category", flex: 1 },
            { field: "itemName", headerName: "Item Name", flex: 1 },
            { field: "itemType", headerName: "Item Type", flex: 1 },
            { field: "unitOfMeasure", headerName: "Unit of measure", flex: 1 },
            { field: "manufacturer", headerName: "Manufacturer", flex: 2 },
            { field: "supplier", headerName: "Supplier", flex: 2 },
            { field: "itemDescription", headerName: "Description", flex: 1 },
            {
              field: "quantity",
              headerName: "Quantity",
              type: "number",
              headerAlign: "left",
              align: "left",
              flex: 0.5,
            },
            { field: "dateAdded", headerName: "Date added", flex: 1 },

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
                    variant="primary"
                    onClick={() => handleDeleteProduct(params.row._id)}
                  >
                    <FaArchive />
                  </Button>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleEditDialogOpen(params.row)}
                  >
                    <FaEdit />
                  </Button>
                </div>
              ),
              flex:1,
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

            <Form.Group controlId="editCategory">
            <Form.Label>Edit Category</Form.Label>
            <Form.Control
              as="select"
              defaultValue={editProduct ? editProduct.category : ""}
              required
            >
              <option value="" disabled>Select Category</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Food">Food</option>
            </Form.Control>
          </Form.Group>
            <Form.Group className="mb-3" controlId="editName">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                defaultValue={editProduct ? editProduct.itemName : ""}
                required
              />
            </Form.Group>
            <Form.Group controlId="editType">
            <Form.Label>Edit Type Of Item</Form.Label>
            <Form.Control
              as="select"
              defaultValue={editProduct ? editProduct.itemType : ""}
              required
            >
              <option value="">Select Unit of Measure</option>
              <option value="Drops">Drops</option>
              <option value="Capsule">Capsule</option>
              <option value="Tablet">Tablet</option>
              <option value="Syrup">Syrup</option>
              <option value="Animal Food">Animal Food</option>
              <option value="Supply">Supply</option>
            </Form.Control>
          </Form.Group>

                <Form.Group className="mb-3" controlId="editUnitOfMeasure">
              <Form.Label>Edit Unit Of Measure</Form.Label>
              <Form.Control
                type="text"
                placeholder="Edit Unit Of Measure" 
                defaultValue={editProduct ? editProduct.unitOfMeasure: ""}
                required
              />
            </Form.Group>
  
                 <Form.Group controlId="editManufacturer">
                  <Form.Label>Edit Manufacturer</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue={editProduct ? editProduct.manufacturer : ""}
                    required
                  >
                   <option value="" disabled>Select Manufacturer</option>
                    <option value="Trenchant Trading Incorporated">Trenchant Trading Incorporated</option>
                  </Form.Control>
                </Form.Group>
                
                <Form.Group controlId="editSupplier">
                  <Form.Label>Edit Supplier</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue={editProduct ? editProduct.supplier : ""}
                    required
                  >
                    <option value="">Select Supplier</option>
                    <option value="City General Services Office">City General Services Office</option>
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
          <Form.Group className="mb-3" controlId="editDateAdded">
            <Form.Label>Date Added</Form.Label>
            <Form.Control
              type="date"
              defaultValue={editProduct ? editProduct.dateAdded : ""}
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