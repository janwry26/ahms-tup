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
import http from "../../utils/http";
import { formatDate } from "../../utils/formatDate";

const AnimalRecords = () => {
  const [records, setRecords] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [species, setSpecies] = useState('');
  const [gender, setGender] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSpeciesChange = (event) => {
    setSpecies(event.target.value);
  };  
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  }; 
  const getAnimalRecord = () => {
    http.get('/animal/view')
        .then((res) => {
          const records = res.data.map((record, key) => ({
            id: key+1,
            _id: record._id,
            animalID: record.animalID,
            animalName: record.animalName,
            species: record.species,
            age: record.age,
            gender: record.gender,             
            breedType: record.breedType,
            weight: record.weight,
            birthDate: formatDate(record.birthDate),
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
    http
      .post('/animal/add', {
        animalName: event.target.animalName.value,
        species: event.target.species.value,
        age: event.target.age.value,
        gender: event.target.gender.value,
        breedType: event.target.breedType.value,
        weight: event.target.weight.value,
        birthDate: event.target.birthDate.value,
      })
      .then((res) => {
        console.log(res);
        Swal.fire({
          title: 'Success',
          text: 'Animal recorded successfully',
          icon: 'success',
          timer: 700, // Show the alert for 2 seconds
          showConfirmButton: false
        });
        getAnimalRecord(); // Refresh the products list
        handleClose()
        setGender('');
        setSpecies('');
      })
      .catch((err) => console.log(err));
    event.target.reset();
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
          animalName: document.getElementById("editAnimalName").value,
          species: document.getElementById("editSpecies").value,
          age: document.getElementById("editAge").value,
          gender: document.getElementById("editGender").value,
          breedType: document.getElementById("editBreedType").value,
          weight: document.getElementById("editWeight").value,
          birthDate: document.getElementById("editBirthDate").value,
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
    <Box m="20px" width="80%" margin="0 auto">
      <Header
        title="ANIMAL RECORDS"
        subtitle="Manage animal records"
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
      <Box marginBottom="10px">
      <InputLabel >Name</InputLabel>
          <TextField
              placeholder="Input animal name..."
              name="animalName"
              variant="filled"
              fullWidth
              required
            />
      </Box>
      <Box marginBottom="10px">
        <InputLabel>Species</InputLabel>
        <TextField
          select
          value={species}
          name="species"
          variant="filled"
          fullWidth
          required
          SelectProps={{ displayEmpty: true }}
        InputLabelProps={{ shrink: true }}
        onChange={handleSpeciesChange}
        >
          <MenuItem value="" disabled> Select species</MenuItem>  
          <MenuItem value="lion">Lion</MenuItem>
          <MenuItem value="tiger">Tiger</MenuItem>
          <MenuItem value="giraffe">Giraffe</MenuItem>
          <MenuItem value="elephant">Elephant</MenuItem>
          <MenuItem value="zebra">Zebra</MenuItem>
          <MenuItem value="crocodile">Crocodile</MenuItem>
          <MenuItem value="orangutan">Orangutan</MenuItem>
          <MenuItem value="chimpanzee">Chimpanzee</MenuItem>
          <MenuItem value="gorilla">Gorilla</MenuItem>
          <MenuItem value="penguin">Penguin</MenuItem>
          <MenuItem value="flamingo">Flamingo</MenuItem>
          <MenuItem value="kangaroo">Kangaroo</MenuItem>
          <MenuItem value="hippopotamus">Hippopotamus</MenuItem>
          <MenuItem value="snake">Snake</MenuItem>
          <MenuItem value="owl">Owl</MenuItem>
          <MenuItem value="parrot">Parrot</MenuItem>
          <MenuItem value="macaw">Macaw</MenuItem>
          <MenuItem value="monkey">Monkey</MenuItem>
          <MenuItem value="bear">Bear</MenuItem>
          <MenuItem value="turtle">Turtle</MenuItem>
          <MenuItem value="cheetah">Cheetah</MenuItem>
          <MenuItem value="rhinoceros">Rhinoceros</MenuItem>
          <MenuItem value="leopard">Leopard</MenuItem>
          <MenuItem value="koala">Koala</MenuItem>
          <MenuItem value="meerkat">Meerkat</MenuItem>
          <MenuItem value="ostrich">Ostrich</MenuItem>
          <MenuItem value="peacock">Peacock</MenuItem>
          <MenuItem value="hyena">Hyena</MenuItem>
          <MenuItem value="red-panda">Red Panda</MenuItem>
          <MenuItem value="squirrel-monkey">Squirrel Monkey</MenuItem>
          <MenuItem value="gibbon">Gibbon</MenuItem>
          <MenuItem value="toucan">Toucan</MenuItem>
          <MenuItem value="camel">Camel</MenuItem>
          <MenuItem value="llama">Llama</MenuItem>
          <MenuItem value="wallaby">Wallaby</MenuItem>
          <MenuItem value="otter">Otter</MenuItem>
          <MenuItem value="seal">Seal</MenuItem>
          <MenuItem value="wolf">Wolf</MenuItem>
          <MenuItem value="reptiles">Reptiles</MenuItem>
        </TextField>
      </Box>

      <Box marginBottom="10px">
      <InputLabel >Animal Age</InputLabel>
          <TextField
              placeholder="Input animal age..."
              name="age"
              variant="filled"
              fullWidth
              required
              type="number"
            />
      </Box>


        <Box marginBottom="10px">
        <InputLabel>Gender</InputLabel>
        <TextField
          select
          value={gender}
          name="gender"
          variant="filled"
          fullWidth
          required
          SelectProps={{ displayEmpty: true }}
        InputLabelProps={{ shrink: true }}
        onChange={handleGenderChange}
        >
          <MenuItem value="" disabled> Select Gender</MenuItem>  
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          </TextField>
          </Box>
  
            <Box marginBottom="10px">
               <InputLabel>Breed Type</InputLabel>
                  <TextField
                  placeholder="Input breed type"
                    name="breedType"
                    
                    fullWidth
                    required
                    variant="filled"
                 />
                </Box>
    
      
                <Box marginBottom="10px">
            <InputLabel >Animal Weight</InputLabel>
                <TextField
                    placeholder="Input animal weight in kg..."
                    name="weight"
                    variant="filled"
                    fullWidth
                    required
                  />
            </Box>
            <Box marginBottom="10px">
            <InputLabel >Animal Birth Date</InputLabel>
                <TextField
                    placeholder="Input animal birthday..."
                    name="birthDate"
                    variant="filled"
                    fullWidth
                    required
                    type="date"
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

          rows={records}
          columns={[
            { field: "animalName", headerName: "Animal name", flex: 1 },
            { field: "species", headerName: "Species", flex: 1 },
            { field: "age", headerName: "Age", flex: 1 },
            { field: "gender", headerName: "Gender", flex: 1 },
            // { field: "animalID", headerName: "Animal ID", flex: 1 },
            { field: "breedType", headerName: "Breed Type", flex: 1 },
            { field: "weight", headerName: "Weight", flex: 0.6 },
            { field: "birthDate", headerName: "Birth Date", flex: 1 },
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
              flex: 0.5,
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

          <Form.Group className="mb-3" controlId="editAnimalName">
              <Form.Label>Animal Name</Form.Label>
              <Form.Control
               name="editAnimalName"
                type="text"
                placeholder="Enter animal name"
                defaultValue={editRecord ? editRecord.animalName : ""}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editSpecies">
              <Form.Label>Species</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter species"
                defaultValue={editRecord ? editRecord.species : ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter age"
                defaultValue={editRecord ? editRecord.age : ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control as="select" defaultValue={editRecord ? editRecord.gender : ""} required>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Control>
            </Form.Group>

           <Form.Group className="mb-3" controlId="editBreedType">
            <Form.Label>Breed Type</Form.Label>
            <Form.Control type="text" placeholder="input breed type" defaultValue={editRecord ? editRecord.breedType : ""} required>
              
            </Form.Control>
          </Form.Group>


            <Form.Group className="mb-3" controlId="editWeight">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter weight"
                defaultValue={editRecord ? editRecord.weight : ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editBirthDate">
              <Form.Label>Birth Date</Form.Label>
              <Form.Control
                type="date"
                defaultValue={editRecord ? editRecord.birthDate : ""}
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
