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
    height: 'auto',
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
          <Select
            name="animalID"
            native
            fullWidth
            required
            variant="filled"
          >
            <option value="" >Select an Animal</option>
            {animalList.map((val) => {
                return (
                  <option value={val.animalID} key={val.animalID}>{val.species}</option>
                )
            })}          
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
              placeholder="Only veterinarian can access on edit"
              name="medication"
              variant="filled"
              fullWidth
              required
              disabled
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
          <Select
            name="staffID"
            native
            fullWidth
            required
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
          rows={reports}
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
          {/* <Box marginBottom="10px">
            <InputLabel >Common name</InputLabel>
            <Select
            name="animalID"
            native
            fullWidth
            required
            disabled
            variant="filled"
            defaultValue={editReport ? editReport.species: ""}

          >
            <option value="" >Select an Animal</option>
            {animalList.map((val) => {
                return (
                  <option value={val.animalID} key={val.animalID}>{val.species}</option>
                )
            })}          
          </Select>
            </Box> */}

     
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
                defaultValue={editReport ? editReport.dateObserved : ""}
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
