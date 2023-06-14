import * as React from 'react';
import Modal from '@mui/material/Modal';
import { Form, Button } from "react-bootstrap";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField,InputLabel, Select, MenuItem } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaPlus, FaArchive, FaEdit } from "react-icons/fa";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState,useEffect } from "react";
import "../../styles/loader.css"
import http from "../../utils/http";
import { format } from "date-fns";
import { formatDate } from "../../utils/formatDate";

const MedicalHistory = () => {
  const [reports, setReports] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editReport, setEditReport] = useState(null);
  const [animalList, setAnimalList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimalID, setSelectedAnimalID] = useState('');
  const [staffSearchTerm, setStaffSearchTerm] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getHealthReport = () => {
    http.get('/health-report/view')
    .then((res) => {
      const reportPromises = res.data.map((report, key) => {
        const animalRequest = http.get(`/animal/view/${report.animalID}`);
        const staffRequest = http.get(`/user/view/${report.staffID}`);

        return Promise.all([animalRequest, staffRequest])
          .then(([animalRes, staffRes]) => {
            const species = animalRes.data.species;
            const staffName = `${staffRes.data.lastName}, ${staffRes.data.firstName}`;

            return {
              id: key + 1,
              _id: report._id,
              animalID: report.animalID,
              staffID: report.staffID,
              species: species,
              staffName: staffName,
              enclosure : report.enclosure,
              nickname: report.nickname,
              age: report.age,
              dateObserved: format(new Date(report.dateObserved), "MMMM d, yyyy"),
              healthDescription: report.healthDescription,
              nextCheckupDate: report.nextCheckupDate,
              medication: report.medication,
              vaccineStatus: report.vaccineStatus,
              veterinarian: report.veterinarian,
              animalHealth: report.animalHealth,

            };
          });
      });

      Promise.all(reportPromises)
        .then((reports) => {
          setReports(reports);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  }



  const getAnimals = () => {
    
    http.get('/animal/view')
        .then((res) => {
          setAnimalList(res.data);
        })
        .catch((err) => console.log(err));
  }

  const getStaffs = () => {
    
    http.get('/user/view')
        .then((res) => {
          setStaffList(res.data);
        })
        .catch((err) => console.log(err));
  }
  
  useEffect(() => {
    getHealthReport();
    getAnimals();
    getStaffs();
  },[])

  const handleAddReport = (event) => {
    event.preventDefault();
    http
      .post('/health-report/add', {
        enclosure: event.target.enclosure.value,
        nickname: event.target.nickname.value,
         dateObserved: event.target.dateObserved.value,
        age :event.target.age.value,
        animalID: event.target.animalID.value,
        staffID: event.target.staffID.value,
        healthDescription: event.target.healthDescription.value,
        nextCheckupDate: event.target.nextCheckupDate.value,
        medication: event.target.medication.value,
        vaccineStatus: event.target.vaccineStatus.value,
        veterinarian :event.target.veterinarian.value,
        animalHealth:event.target.animalHealth.value
      })
      .then((res) => {
        console.log(res);
        Swal.fire({
          title: 'Success',
          text: 'Animal Medical History Added Successfully',
          icon: 'success',
          timer: 700, // Show the alert for 2 seconds
          showConfirmButton: false
        });
        getHealthReport(); // Refresh the products list
        handleClose();
      })
      .catch((err) => console.log(err));
    event.target.reset();
  };


  const handleEditReport = (params, event) => {
    const { id, field, props } = params;
    const { value } = event.target;
    const newReports = reports.map((report) => {
      if (report.id === id) {
        return { ...report, [field]: value };
      }
      return report;
    });
    setReports(newReports);
  };


  const handleEditDialogOpen = (report) => {
    setEditReport(report);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

 

  const handleEditDialogSave = () => {
    const editedReport = {
      // animalID: document.getElementById("editSpecies").value,
      nickname: document.getElementById("editNickname").value,
      enclosure: document.getElementById("editEnclosure").value,
      age: document.getElementById("editAge").value,
      dateObserved: document.getElementById("editDateObserved").value,
      veterinarian: document.getElementById("editVeterinarian").value,
      staffID: document.getElementById("editStaffName").value,
      healthDescription: document.getElementById("editHealthDescription").value,
     nextCheckupDate: document.getElementById("editRemarks").value,
      medication: document.getElementById("editMedication").value,
      vaccineStatus: document.getElementById("editVaccinationStatus").value,
      animalHealth: document.getElementById("editAnimalHealth").value,
    };
  
    http
      .put(`/health-report/edit/${editReport._id}`, editedReport)
      .then((res) => {
        console.log(res);
        const updatedReports = reports.map((report) =>
          report._id === editReport._id ? { ...report, ...editedReport } : report
        );
        setReports(updatedReports);
        setEditDialogOpen(false);
        Swal.fire('Success', 'Animal Medical History updated successfully!', 'success').then(()=>window.location.reload());
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteReport = (_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'The Animal Medical History Will Be Archived',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, archive it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        http
          .put(`/health-report/archive/${_id}`)
          .then((res) => {
            console.log(res);
            Swal.fire('Archived!', 'Your Animal Medical History Has Been Archived.', 'success');
            getHealthReport(); // Refresh the products list
          })
          .catch((err) => console.log(err));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Animal Medical History is safe :)', 'error');
      }
    });
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
        title="MEDICAL RECORDS"
        subtitle="Manage medical records"
        fontSize="36px"
        mt="20px"
      />
      <Button onClick={handleOpen} className="btn btn-color" >Add Report</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
      <Form onSubmit={handleAddReport}>

      <Box marginBottom="10px">
          <InputLabel >Nickname</InputLabel>
            <TextField
                placeholder="Input animal nickname..."
                name="nickname"
                variant="filled"
                fullWidth
                required
              />
        </Box>
    
          <Box marginBottom="10px">
            <InputLabel>Common Name</InputLabel>
            <TextField
              type="text"
              fullWidth
              variant='filled'
              placeholder="Search by common name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              name="animalID"
              native
              fullWidth
              required
              variant="filled"
              value={selectedAnimalID}
              onChange={(e) => setSelectedAnimalID(e.target.value)}
            >
              <option value="">Select an Animal</option>
              {animalList
                .filter((val) => {
                  // Filter the animalList based on the search term
                  if (searchTerm === '') return true;
                  return val.species.toLowerCase().includes(searchTerm.toLowerCase());
                })
                .map((val) => (
                  <option value={val.animalID} key={val.animalID}>
                    {val.species}
                  </option>
                ))}
            </Select>
          </Box>
        <Box marginBottom="10px">
          <InputLabel >Enclosure</InputLabel>
            <TextField
                placeholder="Input enclosure..."
                name="enclosure"
                variant="filled"
                fullWidth
                required
              />
        </Box>
        <Box marginBottom="10px">
        <InputLabel >Date of Observation</InputLabel>
          <TextField
              placeholder="Input next checkup date..."
              name="dateObserved"
              variant="filled"
              fullWidth
              required
              type="date"
            />
        </Box>
        <Box marginBottom="10px">
            <InputLabel>Animal Age</InputLabel>
            <Select
              name="age"
              variant="filled"
              fullWidth
              required
              displayEmpty
            >
              <MenuItem value="" disabled>Select animal age</MenuItem>

              <MenuItem value="newborn">Newborn</MenuItem>
              <MenuItem value="juvenile">Juvenile</MenuItem>
              <MenuItem value="adult">Adult</MenuItem>
              <MenuItem value="elderly">Elderly</MenuItem>
            </Select>
        </Box>
        <Box marginBottom="10px">
            <InputLabel>Animal Health</InputLabel>
            <Select
              name="animalHealth"
              variant="filled"
              fullWidth
              required
              displayEmpty
            >
              <MenuItem value="" disabled>Select animal health</MenuItem>
            
              <MenuItem value="Normal">Normal</MenuItem>
              <MenuItem value="Mild">Mild</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="Deceased">Deceased</MenuItem>
            </Select>
        </Box>

        
        <Box marginBottom="10px">
          <InputLabel >Case</InputLabel>
            <TextField
                placeholder="Input health description..."
                name="healthDescription"
                variant="filled"
                fullWidth
                required
              />
        </Box>
        <Box marginBottom="10px">
        <InputLabel >Treatment</InputLabel>
          <TextField
              placeholder="input treatment"
              name="medication"
              variant="filled"
              fullWidth
              required
              // disabled
            />
        </Box>
            
        <Box marginBottom="10px">
        <InputLabel >Remarks</InputLabel>
          <TextField
              placeholder="Input remarks..."
              name="nextCheckupDate"
              variant="filled"
              fullWidth
              required
              type="text"
            />
        </Box>

        <Box marginBottom="10px">
  <InputLabel>Staff</InputLabel>
  <TextField
    type="text"
    fullWidth
    variant='filled'
    placeholder="Search by staff name..."
    value={staffSearchTerm}
    onChange={(e) => setStaffSearchTerm(e.target.value)}
  />

  <Select
    name="staffID"
    native
    fullWidth
    required
    variant="filled"
  >
    <option value="">Select a Staff</option>
    {staffList
      .filter((val) => {
        // Filter the staffList based on the search term
        if (staffSearchTerm === '') return true;
        return (
          val.lastName.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
          val.firstName.toLowerCase().includes(staffSearchTerm.toLowerCase())
        );
      })
      .map((val) => (
        <option value={val.staffId} key={val.staffId}>
          {val.lastName + ', ' + val.firstName}
        </option>
      ))}
  </Select>
</Box>
        <Box marginBottom="10px">
        <InputLabel >Veterinarian</InputLabel>
          <TextField
              placeholder="Input veterinarian..."
              name="veterinarian"
              variant="filled"
              fullWidth
              required
              type="text"
            />
        </Box>
        <Box marginBottom="10px">
          <InputLabel>Vaccination Status</InputLabel>
          <Select
            name="vaccineStatus"
            native
            fullWidth
            required
            variant="filled"
          >
            <option value="" >Select vaccination status</option>
            <option value="Vaccinated">Vaccinated</option>
            <option value="Not Vaccinated">Not Vaccinated</option>
          </Select>
        </Box>
   
        <div className="d-grid gap-2" style={{ marginTop: "-20px", marginBottom: "20px" }}>
          <Button className="btnDashBoard"type="submit" >
            <FaPlus /> Add Report
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
            <p>Nickname : <span>{selectedRow.nickname}</span></p>
             
            <p>Common Name : <span>{selectedRow.species}</span></p>
            <p>Enclosure : <span>{selectedRow.enclosure}</span></p>
            <p>Date of Observation : <span>{selectedRow.dateObserved}</span></p>
            <p>Age: <span>{selectedRow.age}</span></p>
            <p>Health Description: <span>{selectedRow.healthDescription}</span></p>
            <p>Treatment: <span>{selectedRow.medication}</span></p>
            <p>Animal Health: <span>{selectedRow.animalHealth}</span></p>
            <p>Next Checkup Date: <span>{selectedRow.nextCheckupDate}</span></p>
            <p>Reported By: <span>{selectedRow.staffName}</span></p>
            <p>Veterinarian: <span>{selectedRow.veterinarian}</span></p>
            <p>Vaccine Status: <span>{selectedRow.vaccineStatus}</span></p>
           
              
              {/* Render other fields as needed */}
            </DialogContent>
          </Dialog>
        )}


        <DataGrid
          rows={reports}
          onCellClick={(params, event) => {
            if (event.target.classList.contains('MuiDataGrid-cell')) {
              setSelectedRow(params.row);
            }
          }}
          columns={[
            { field: "nickname", headerName: "Nickname", flex: 1 },
            { field: "species", headerName: "Common Name", flex: 1 },
            { field: "enclosure", headerName: "Enclosure", flex: 1 },
            { field: "dateObserved", headerName: "Date of Observation", flex: 1 },
            { field: "age", headerName: "Age", flex: 0.8 },
            { field: "healthDescription", headerName: "Case", flex: 1 },
            { field: "medication", headerName: "Treatment", flex: 1 },
            { field: "animalHealth", headerName: "Animal Health", flex: 1 },
            { field: "nextCheckupDate", headerName: "Remarks", flex: 1 },
            { field: "staffName", headerName: "Reported By", flex: 1 },
            { field: "veterinarian", headerName: "Veterinarian", flex: 1 },
            {
              field: "vaccineStatus",
              headerName: "Vaccination Status",
              flex: 1,
            },
            {
              field: "actions",
              headerName: "Actions",
              sortable: false,
              filterable: false,
              renderCell: (params) => (
                <div style={{ marginTop: "5px auto" }}>
                  <Button
                    className="btn btn-primary btn-sm mx-1"
                    onClick={() => handleDeleteReport(params.row._id)}
                  
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
              flex: 0.7,
            },
          ]}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Report</DialogTitle>
        <DialogContent>
          <Form onSubmit={handleEditReport}>
        
          <Box marginBottom="10px">
          <Form.Group className="mb-3" controlId="editNickname">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter health description"
                defaultValue={editReport ? editReport.nickname: ""}
                required
              />
            </Form.Group>
            </Box>


     
          <Form.Group className="mb-3" controlId="editEnclosure">
              <Form.Label>Enclosure</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter health description"
                defaultValue={editReport ? editReport.enclosure : ""}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editDateObserved">
              <Form.Label>Date of Observation</Form.Label>
              <Form.Control
                type="date"
                defaultValue={editReport ? formatDate(editReport.dateObserved) : ""}
                required
              />
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="editAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="text"
                placeholder="Edit animal age"
                defaultValue={editReport ? editReport.age : ""}
                required
              />
            </Form.Group> */}
             <Form.Group className="mb-3" controlId="editAge">
            <Form.Label>Animal Age</Form.Label>
            <Form.Select defaultValue={editReport ? editReport.age : ""} required>
              <option value="">Select animal age</option>
              <option value="newborn">New Born</option>
              <option value="juvenile">Juvenile</option>
              <option value="adult">Adult</option>
              <option value="elderly">Elderly</option>
            </Form.Select>
            
          </Form.Group>

          <Form.Group className="mb-3" controlId="editAnimalHealth">
            <Form.Label>Animal Health</Form.Label>
            <Form.Select defaultValue={editReport ? editReport.animalHealth : ""} required>
              <option value="">Select animal health</option>
              <option value="normal">Normal</option>
              <option value="mild">Mild</option>
              <option value="critical">Critical</option>
              <option value="deceased">Deceased</option>
            </Form.Select>
            
          </Form.Group>
            <Form.Group className="mb-3" controlId="editHealthDescription">
              <Form.Label>Case</Form.Label>
              <Form.Control
                type="text"
                placeholder="Edit case"
                defaultValue={editReport ? editReport.healthDescription : ""}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                placeholder="edit remarks"
                defaultValue={editReport ? editReport.nextCheckupDate : ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editMedication">
              <Form.Label>Medication</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter medication"
                defaultValue={editReport ? editReport.medication : ""}
                required
              />
            </Form.Group>

           


             <Box marginBottom="10px">
              <InputLabel>Staff</InputLabel>
              <Select
                id="editStaffName"
                native
                fullWidth
                required
                defaultValue={editReport ? editReport.staffID : ""}

                variant="filled"
              >
                <option value="" >Select a Staff</option>
                {staffList.map((val) => {
                    return (
                      <option value={val.staffId} key={val.staffId}>{val.lastName + ', ' + val.firstName}</option>
                    )
                })}          
              </Select>
            </Box>

            
            <Form.Group className="mb-3" controlId="editVeterinarian">
              <Form.Label>Veterinarian</Form.Label>
              <Form.Control
                type="text"
                defaultValue={editReport ? editReport.veterinarian : ""}
                required
              />
            </Form.Group>

           

            <Form.Group className="mb-3" controlId="editVaccinationStatus">
            <Form.Label>Vaccination Status</Form.Label>
            <Form.Select defaultValue={editReport ? editReport.vaccineStatus : ""} required>
              <option value="">Select vaccination status</option>
              <option value="Vaccinated">Vaccinated</option>
              <option value="Not Vaccinated">Not Vaccinated</option>
            </Form.Select>
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

export default MedicalHistory;
