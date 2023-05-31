import { useState,useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField,InputLabel, Select } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import "../../styles/loader.css"

const AnimalRecords = () => {
  const [records, setRecords] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const genderOptions = ["Male", "Female"];
  
  const handleAddRecord = (event) => {
    event.preventDefault();
    const record = {
      id: Date.now(),
      species: event.target.species.value,
      age: event.target.age.value,
      gender: event.target.gender.value,
      animalID: event.target.animalID.value,
      breedType: event.target.breedType.value,
      weight: event.target.weight.value,
      birthDate: event.target.birthDate.value,
    };
    setRecords([...records, record]);
    event.target.reset();
  };

  const handleDeleteRecord = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const newRecords = [...records];
        newRecords.splice(index, 1);
        setRecords(newRecords);
        Swal.fire("Deleted!", "Your record has been deleted.", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your record is safe :)", "error");
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
    const newRecords = records.map((record) => {
      if (record.id === editRecord.id) {
        return {
          ...record,
          species: document.getElementById("editSpecies").value,
          age: document.getElementById("editAge").value,
          gender: document.getElementById("editGender").value,
          animalID: document.getElementById("editAnimalID").value,
          breedType: document.getElementById("editBreedType").value,
          weight: document.getElementById("editWeight").value,
          birthDate: document.getElementById("editBirthDate").value,
        };
      }
      return record;
    });
    setRecords(newRecords);
    setEditDialogOpen(false);
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
    <h1>Loading...</h1>
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
      <Form onSubmit={handleAddRecord}>
      <Box marginBottom="10px">
      <InputLabel >Species</InputLabel>
          <TextField
              placeholder="Input animal species..."
              name="species"
              variant="filled"
              fullWidth
              required
            />
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
               <InputLabel>Animal Gender</InputLabel>
                  <Select
                    name="gender"
                    native
                    fullWidth
                    required
                    variant="filled"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Select>
                </Box>
    
            <Box marginBottom="10px">
            <InputLabel >Animal Id</InputLabel>
                <TextField
                    placeholder="Input animal ID..."
                    name="animalID"
                    variant="filled"
                    fullWidth
                    required
                    type="number"
                  />
            </Box>


            <Box marginBottom="10px">
               <InputLabel>Breed Type</InputLabel>
                  <TextField
                  placeholder="Input breed type"
                    name="breedType"
                    native
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
            { field: "species", headerName: "Species", flex: 1 },
            { field: "age", headerName: "Age", flex: 1 },
            { field: "gender", headerName: "Gender", flex: 1 },
            { field: "animalID", headerName: "Animal ID", flex: 1 },
            { field: "breedType", headerName: "Breed Type", flex: 1 },
            { field: "weight", headerName: "Weight", flex: 1 },
            { field: "birthDate", headerName: "Birth Date", flex: 1 },
            {
              field: "actions",
              headerName: "",
              sortable: false,
              filterable: false,
              renderCell: (params) => (
                <div style={{ marginTop: "5px auto" }}>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteRecord(params.rowIndex)}
                    style={{ padding: "6px 12px" }}
                  >
                    <FaTrash />
                  </Button>
                  <Button
                    variant="primary"
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


            <Form.Group className="mb-3" controlId="editAnimalID">
              <Form.Label>Animal ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter animal ID"
                defaultValue={editRecord ? editRecord.animalID : ""}
                required
              />
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
