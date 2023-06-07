import * as React from 'react';
import Modal from '@mui/material/Modal'; 
import { Form, Button } from "react-bootstrap";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField,InputLabel, Select } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaPlus, FaArchive, FaEdit } from "react-icons/fa";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import "../../styles/loader.css"
import http from "../../utils/http";
import { formatDate } from "../../utils/formatDate";

const MortalityReport = () => {
  const [reports, setReports] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editReport, setEditReport] = useState(null);
  const [animalList, setAnimalList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(""); // Step 1

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const getMortalityReport = () => {
    http.get('/mortality-report/view')
    .then((res) => {
      const reportPromises = res.data.map((report, key) => {
        const animalRequest = http.get(`/animal/view/${report.animalID}`);
        const staffRequest = http.get(`/user/view/${report.staffID}`);

        return Promise.all([animalRequest, staffRequest])
          .then(([animalRes, staffRes]) => {
            const animalName = animalRes.data.animalName;
            const staffName = `${staffRes.data.lastName}, ${staffRes.data.firstName}`;

            return {
              id: key+1,
             _id: report._id,
              animalID: report.animalID,
              staffID: report.staffID,
              animalName: animalName,
              staffName: staffName,
              casueOfDeath: report.casueOfDeath,
              deathDate: formatDate(report.deathDate),
              deathTime: report.deathTime,
              dateReported: formatDate(report.dateReported),
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
    getMortalityReport();
    getAnimals();
    getStaffs();
  },[])

  const handleAddReport = (event) => {
    event.preventDefault();
    http
      .post('/mortality-report/add', {
        animalID: event.target.animalID.value,
        staffID: event.target.staffID.value,
        casueOfDeath: event.target.casueOfDeath.value,
        deathDate: event.target.deathDate.value,
        deathTime: event.target.deathTime.value,
        dateReported: event.target.dateReported.value,
      })
      .then((res) => {
        console.log(res);
        Swal.fire({
          title: 'Success',
          text: 'Report Added Successfully',
          icon: 'success',
          timer: 700, // Show the alert for 2 seconds
          showConfirmButton: false
        });
        getMortalityReport(); // Refresh the products list
        handleClose();
      })
      .catch((err) => console.log(err));
    event.target.reset();
  };
  
  const handleDeleteReport = (_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, archive it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        http
          .put(`/mortality-report/archive/${_id}`)
          .then((res) => {
            console.log(res);
            Swal.fire('Archived!', 'Your report has been archived.', 'success');
            getMortalityReport(); // Refresh the products list
          })
          .catch((err) => console.log(err));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your report is safe :)', 'error');
      }
    });
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
      animalID: document.getElementById("editAnimalName").value,
      staffID: document.getElementById("editStaffName").value,
      casueOfDeath: document.getElementById("editCauseOfDeath").value,
      deathDate: document.getElementById("editDeathDate").value,
      deathTime: document.getElementById("editDeathTime").value,
      dateReported: document.getElementById("editDateReported").value,
    };
  
    http
      .put(`/mortality-report/edit/${editReport._id}`, editedReport)
      .then((res) => {
        const updatedReports = reports.map((report) =>
          report._id === editReport._id ? { ...report, ...editedReport } : report
        );
        setReports(updatedReports);
        setEditDialogOpen(false);
        Swal.fire('Success', 'Report updated successfully!', 'success').then(()=>window.location.reload());
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
    <Box m="20px" width="80%" margin="0 auto" >
      <Header
        title="MORTALITY REPORT"
        subtitle="Manage mortality reports"
        fontSize="36px"
        mt="20px"
      />
       <Button onClick={handleOpen} className="btn btn-color" >Create Report</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
      <Form onSubmit={handleAddReport}>
      <Box marginBottom="10px">
      <InputLabel >Animal</InputLabel>
      <Select
          name="animalID"
          native
          fullWidth
          required
          variant="filled"
        >
          <option value="">Select an Animal</option>
          {animalList.map((val) => {
            const isAnimalInTable = reports.some((report) => report.animalName === val.animalName);
            if (isAnimalInTable) {
              return null; // Hide the option if the animal name is already in the table
            }
            return (
              <option value={val.animalID} key={val.animalID}>
                {val.animalName}
              </option>
            );
          })}
        </Select>

      </Box>

     
        <Box marginBottom="10px">
          <InputLabel>Cause of Death</InputLabel>
          <Select
            name="casueOfDeath"
            native
            fullWidth
            required
            variant="filled"
          >
            <option value="">Select cause of death</option>
            <option value="Age-related conditions">Age-related conditions</option>
            <option value="Disease">Disease</option>
            <option value="Genetic conditions">Genetic conditions</option>
            <option value="Trauma">Trauma</option>
            <option value="Stress-related factors">Stress-related factors</option>
            <option value="Reproductive problems">Reproductive problems</option>
            <option value="Nutritional imbalances">Nutritional imbalances</option>
            <option value="Parasitic infections">Parasitic infections</option>
            <option value="Accidental poisonings">Accidental poisonings</option>
            <option value="Anesthesia-related complications">Anesthesia-related complications</option>
            <option value="Respiratory infections">Respiratory infections</option>
            <option value="Gastrointestinal disorders">Gastrointestinal disorders</option>
            <option value="Cardiovascular diseases">Cardiovascular diseases</option>
            <option value="Renal (kidney) failure">Renal (kidney) failure</option>
            <option value="Neurological disorders">Neurological disorders</option>
          </Select>
        </Box>


          <Box marginBottom="10px">
          <InputLabel >Date</InputLabel>
          <TextField
              placeholder="Input death date..."
              name="deathDate"
              variant="filled"
              fullWidth
              required
              type="date"
            />
          </Box>

          <Box marginBottom="10px">
          <InputLabel >Time of Death</InputLabel>
          <TextField
              placeholder="Input death time..."
              name="deathTime"
              variant="filled"
              fullWidth
              required
              type="time"
            />
          </Box>

          <Box marginBottom="10px">
          <InputLabel >Date Reported</InputLabel>
          <TextField
              placeholder="Input date reported..."
              name="dateReported"
              variant="filled"
              fullWidth
              required
              type="date"

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

        <div className="d-grid gap-2" style={{ marginTop: "-20px", marginBottom: "20px" }}>
          <Button className="btnDashBoard" type="submit">
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
            { field: "animalName", headerName: "Animal Name", flex: 1 },
            { field: "casueOfDeath", headerName: "Cause of Death", flex: 1 },
            { field: "deathDate", headerName: "Death Date", flex: 1 },
            { field: "staffName", headerName: "Reported By", flex: 1 },
            {
              field: "deathTime",
              headerName: "Death Time",
              flex: 1,
              valueFormatter: (params) => {
                const timeParts = params.value.split(":");
                const hours = parseInt(timeParts[0], 10);
                const minutes = parseInt(timeParts[1], 10);
            
                const date = new Date();
                date.setHours(hours);
                date.setMinutes(minutes);
            
                const formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                return formattedTime;
              },
            },
            
            {
              field: "dateReported",
              headerName: "Date Reported",
              flex: 1,
            },
            {
              field: "actions",
              headerName: "Actions",
              sortable: false,
              filterable: false,
              renderCell: (params) => (
                <div>
                  <Button
                  className="btn btn-sm mx-1"
                    variant="primary"
                    onClick={() => handleDeleteReport(params.row._id)}
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
        <DialogTitle>Edit Report</DialogTitle>
        <DialogContent>
          <Form onSubmit={handleEditReport}>
          <Box marginBottom="10px">
            <InputLabel >Animal Name</InputLabel>
            <Select
            id="editAnimalName"
            defaultValue={editReport ? editReport.animalID : ""}
            native
            fullWidth
            required
            variant="filled"
            disabled
          >
            <option value="" >Select an Animal</option>
            {animalList.map((val) => {
                return (
                  <option value={val.animalID} key={val.animalID}>{val.animalName}</option>
                )
            })}          
          </Select>
            </Box>
           <Form.Group className="mb-3" controlId="editCauseOfDeath">
              <Form.Label>Cause of Death</Form.Label>
              <Form.Control
                defaultValue={editReport ? editReport.casueOfDeath : ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editDeathDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                defaultValue={editReport ? editReport.deathDate : ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editDeathTime">
              <Form.Label>Time of Death</Form.Label>
              <Form.Control
                type="time"
                defaultValue={editReport ? editReport.deathTime : ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editDateReported">
              <Form.Label>Date Reported</Form.Label>
              <Form.Control
                type="date"
                defaultValue={editReport ? editReport.dateReported : ""}
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

export default MortalityReport;
