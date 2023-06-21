import * as React from 'react';
import Modal from '@mui/material/Modal'; 
import { useState,useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField,InputLabel, Select,MenuItem } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaPlus, FaArchive, FaEdit } from "react-icons/fa";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import "../../styles/loader.css"
import "../../styles/rows.css"

import http from "../../utils/http";
import { format } from "date-fns";
import { formatDate } from "../../utils/formatDate";

const AnimalRecords = () => {
  const [records, setRecords] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [species, setSpecies] = useState('');
  const [gender, setGender] = useState('');
  const [open, setOpen] = React.useState(false);
  const [nameTakenError, setNameTakenError] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);



  const [customCategory, setCustomCategory] = useState("");


  const [speciesOption, setSpeciesOption] = useState("");
  const [habitatOption, setHabitatOption] = useState("");

  const [speciesList, setSpeciesList] = useState("");
  const [habitatList, setHabitatList] = useState("");

  const [customSpecies, setCustomSpecies] = useState([]);
  const [customHabitat, setCustomHabitat] = useState([]);
  
  const clearCustomInputs = () => { //Second for new page also
    setCustomSpecies();
    setCustomHabitat();
  }

  const getCategoriesData = async () => {
    await http.get('/categories/view')
    .then((res) => {
      console.log(res.data); //Third add as necessary
      setSpeciesList(res.data[7].item);
      setHabitatList(res.data[8].item);
    })
  }

  useEffect(() => {
    getCategoriesData();
  }, []) //For other page

  const handleSpeciesChange = (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory === "Other") {
      setSpeciesOption(selectedCategory);
    } else {
      setSpeciesOption(selectedCategory);
      setCustomCategory("");
    }
  };

  const handleHabitatChange = (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory === "Other") {
      setHabitatOption(selectedCategory);
    } else {
      setHabitatOption(selectedCategory);
      setCustomCategory("");
    }
  };

  const handleCustomCategoryChange = (event) => {
    setCustomCategory(event.target.value);
    setCategory("Other");
  };

  const handleAddCustomCategory = async (_id,_type,value) => {
    await http.post('/categories/add', {
        "categoryId": _id,
        "module": "Animal Records",
        "type": _type,
        "item": [{
            "itemName": value
        }]
    }).then((res) => {
      if (res) {
        alert("Option Added Successfully");
        getCategoriesData();
        // setCategory(customCategory);
        clearCustomInputs();
      }
      
    }).catch((err) => {
      console.log(err);
    })

  };
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getAnimalRecord = () => {
    http.get('/animal/view')
        .then((res) => {
          const records = res.data.map((record, key) => ({
            id: key+1,
            _id: record._id,
            animalID: record.animalID,
            species1: record.species1,
            species: record.species,
            habitat:record.habitat,
            breedType: record.breedType,
            quantity: record.quantity,
            birthDate: format(new Date(record.birthDate), "MMMM d, yyyy"),
          }));
          setRecords(records);
        })
        .catch((err) => console.log(err));
  }

  useEffect(() => {
    getAnimalRecord();
  },[])

  
  const handleAddRecord = (event) => {
    event.preventDefault();
    const species = event.target.species.value.toLowerCase();

    // Check if the animal name is already taken (case-sensitive)
    const isNameTaken = records.some((record) => record.species.toLowerCase() === species);
    if (isNameTaken) {
      setNameTakenError("The animal name is already taken. Please choose a different name.");
    } else {
      http
        .post('/animal/add', {
          // animalName: event.target.animalName.value,
        species1: event.target.species1.value,
        species: event.target.species.value,
        // age: event.target.age.value,
        // gender: event.target.gender.value,
        breedType: event.target.breedType.value,
        habitat: event.target.habitat.value,
        quantity: event.target.quantity.value,
        birthDate: new Date().toLocaleDateString("en-US", { 
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        })
        .then((res) => {
          Swal.fire({
            title: 'Success',
            text: 'Animal recorded successfully',
            icon: 'success',
            timer: 700, // Show the alert for 2 seconds
            showConfirmButton: false
          })

          getAnimalRecord(); // Refresh the products list
          handleClose();
          setGender('');
          setSpecies('');
        })
        .catch((err) => console.log(err));

      event.target.reset();
      setNameTakenError(""); // Clear the error message
    }
  };

  const handleDeleteRecord = (_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'The animal record has been archived',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, archive it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        http
          .put(`/animal/archive/${_id}`)
          .then((res) => {
            console.log(res);
            Swal.fire('Archived!', 'Animal record has beed archived.', 'success');
            getAnimalRecord(); // Refresh the products list
          })
          .catch((err) => console.log(err));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Animal record is safe :)', 'error');
      }
    });
  };

  const handleEditRecord = (params, event) => {
    const { id, field, props } = params;
    const { value } = event.target;
    const newRecords = records.map((record) => {
      if (record.id === id) {
        return { ...record, [field]: value };
      }
      return record;
    });
    setRecords(newRecords);
  };


  const handleEditDialogOpen = (record) => {
    setEditRecord(record);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditDialogSave = () => {
    const editedRecord = {
          species: document.getElementById("editSpecies").value,
          species1: document.getElementById("editSpecies1").value,
          breedType: document.getElementById("editBreedType").value,
          quantity: document.getElementById("editQuantity").value,
          // birthDate: document.getElementById("editBirthDate").value,
          habitat: document.getElementById("editHabitat").value,
    };
  
    http
      .put(`/animal/edit/${editRecord._id}`, editedRecord)
      .then((res) => {
        console.log(res);
        const updatedRecords = records.map((record) =>
          record._id === editRecord._id ? { ...record, ...editedRecord } : record
        );
        setRecords(updatedRecords);
        setEditDialogOpen(false);
        Swal.fire('Success', 'Animal record updated successfully!', 'success');
      })
      .catch((err) => console.log(err));
  };

  const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true); 
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);

  if (isLoading) {
    return <div className="loader-overlay1">
    <div className="loader1"></div>
  </div> // Render the loader while loading
  }
  return (
    <Box m="20px" width="98%" margin="0 auto">
      <Header
        title="ANIMAL DETAILS"
        subtitle="Manage animal details"
        fontSize="36px"
        mt="20px"
      />
       <Button onClick={handleOpen} className="btn btn-color" >Add Animal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
      <Form onSubmit={handleAddRecord}>
      {Boolean(nameTakenError) && (
          <div className="text-danger mt-2">{nameTakenError}</div>
        )}
      <Box marginBottom="10px">
      <InputLabel >Common Name</InputLabel>
          <TextField
              placeholder="Input animal common name..."
              name="species"
              variant="filled"
              fullWidth
              required
            />
      </Box>

 

          <Box marginBottom="10px">
               <InputLabel>Species</InputLabel>
                  <Select
                    name="species1"
                    native
                    fullWidth
                    required
                    variant="filled"
                    value={speciesOption} //Sixth
                    onChange={handleSpeciesChange} //Seventh
                  >
                    <option value="">Select Species</option>
                    {speciesList.map((val) => { //Eigth mapping for the list
                      return (
                        <option key={val.itemId} value={val.itemName}>{val.itemName}</option>
                      )
                    })}
                    <option value="Other">Other</option>                    
                  </Select>

                  {/* Nineth Copy paste and change value, onchange, onClick */}
                  {speciesOption === "Other" && (
                    <TextField
                      label="Custom Category"
                      value={customSpecies}
                      onChange={(e) => {
                        setCustomSpecies(e.target.value);
                        setSpecies("Other");
                      }}
                      fullWidth
                      required
                      variant="filled"
                    />
                  )}
                  {speciesOption === "Other" && (
                    <Button className='btnDashBoard' onClick={()=>handleAddCustomCategory(13,"Species",customSpecies)}>
                      Add Category
                    </Button>
                  )}
                  {/* Nineth Copy paste and change value, onchange, onClick */}
                </Box>

                <Box marginBottom="10px">
               <InputLabel>Habitat</InputLabel>
                  <Select
                    name="habitat"
                    native
                    fullWidth
                    required
                    variant="filled"
                    value={habitatOption} //Sixth
                    onChange={handleHabitatChange} //Seventh
                  >
                    <option value="">Select Habitat</option>
                    {habitatList.map((val) => { //Eigth mapping for the list
                      return (
                        <option key={val.itemId} value={val.itemName}>{val.itemName}</option>
                      )
                    })}
                    <option value="Other">Other</option>                    
                  </Select>

                  {/* Nineth Copy paste and change value, onchange, onClick */}
                  {habitatOption === "Other" && (
                    <TextField
                      label="Custom Category"
                      value={customHabitat}
                      onChange={(e) => {
                        setCustomHabitat(e.target.value);
                        setHabitat("Other");
                      }}
                      fullWidth
                      required
                      variant="filled"
                    />
                  )}
                  {habitatOption === "Other" && (
                    <Button className='btnDashBoard' onClick={()=>handleAddCustomCategory(14,"Habitat",customHabitat)}>
                      Add Category
                    </Button>
                  )}
                  {/* Nineth Copy paste and change value, onchange, onClick */}
                </Box>
  
            <Box marginBottom="10px">
               <InputLabel>Scientific Name</InputLabel>
                  <TextField
                  placeholder="Input scientific name"
                    name="breedType"
                    
                    fullWidth
                    required
                    variant="filled"
                 />
                </Box>
             

        

            
                  <Box marginBottom="10px">
                  <InputLabel >Quantity</InputLabel>
                      <TextField
                          placeholder="Input animal quantity..."
                          name="quantity"
                          variant="filled"
                          type='number'
                          fullWidth
                          required
                        />
                  </Box>
       

        <div className="d-grid gap-2" style={{ marginTop: "-20px", marginBottom: "20px" }}>
          <Button className="btnDashBoard"  type="submit" >
            <FaPlus /> Add Record
          </Button>
        </div>
      </Form>
      </Box>
      </Modal>
      <Box
        m="40px 0 0 0"
        height="75vh"
        margin="0 auto"
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
         {selectedRow && (
          <Dialog open={Boolean(selectedRow)} onClose={() => setSelectedRow(null)}>
            <DialogTitle><h4>Full Details</h4></DialogTitle>
            <DialogContent>
             
            <p>Common Name : <span>{selectedRow.species}</span></p>
            <p>Habitat : <span>{selectedRow.habitat}</span></p>
            <p>Breed Type : <span>{selectedRow.breedType}</span></p>
            <p>Species: <span>{selectedRow.species1}</span></p>
            <p>Quantity: <span>{selectedRow.quantity}</span></p>
            <p>Date Added: <span>{selectedRow.birthDate}</span></p>
           
              
              {/* Render other fields as needed */}
            </DialogContent>
          </Dialog>
        )}

        <DataGrid

          rows={records}
          onCellClick={(params, event) => {
            if (event.target.classList.contains('MuiDataGrid-cell')) {
              setSelectedRow(params.row);
            }
          }}
          columns={[
            { field: "species", headerName: "Common name", flex: 1 },
            { field: "habitat", headerName: "Habitat", flex: 1.5 },
            { field: "breedType", headerName: "Scientific Name", flex: 1 },
            { field: "species1", headerName: "Species", flex: 1 },
            { field: "quantity", headerName: "Quantity", flex: 0.5 },
            { field: "birthDate", headerName: "Date Added", flex: 1 },
            {
              field: "actions",
              headerName: "Actions",
              sortable: false,
              filterable: false,
              align: "center",
              renderCell: (params) => (
                <div>
                  <Button
                    className="mx-1 btn-primary btn-sm"
                    onClick={() => handleDeleteRecord(params.row._id)}
                    style={{ padding: "6px 12px" }}
                  >
                    <FaArchive />
                  </Button>
                  <Button
                  size="sm"
                    variant="warning"
                    onClick={() => handleEditDialogOpen(params.row)}
                    style={{ padding: "6px 12px" }}
                  >
                    <FaEdit />
                  </Button>
                </div>
              ),
              flex: 0.7,
            },
          ]}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Record</DialogTitle>
        <DialogContent>
          <Form onSubmit={handleEditRecord}>

            <Form.Group className="mb-3" controlId="editSpecies">
              <Form.Label>Common Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter common name"
                defaultValue={editRecord ? editRecord.species : ""}
                required
              />
            </Form.Group>

           <Form.Group className="mb-3" controlId="editBreedType">
            <Form.Label>Scientific Name</Form.Label>
            <Form.Control type="text" placeholder="input breed type" defaultValue={editRecord ? editRecord.breedType : ""} required>
            </Form.Control>
          </Form.Group>
        
        <Form.Group className="mb-3" controlId="editSpecies1">
            <Form.Label>Species</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter quantity"
                defaultValue={editRecord ? editRecord.species1 : ""}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter quantity"
                defaultValue={editRecord ? editRecord.quantity : ""}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editHabitat">
              <Form.Label>Habitat</Form.Label>
              <Form.Control
                type="text"
                placeholder="edit habitat"
                defaultValue={editRecord ? editRecord.habitat : ""}
                required
              />
            </Form.Group>

          </Form>
        </DialogContent>
        <DialogActions>
          <Button variant="warning" onClick={handleEditDialogClose}>
            Cancel
          </Button>
          <Button variant="success" color="danger" onClick={handleEditDialogSave} type="submit">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnimalRecords;
