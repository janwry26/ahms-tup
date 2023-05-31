import { Form, Button } from "react-bootstrap";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField,InputLabel, Select } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState,useEffect } from "react";
import "../../styles/loader.css"
import http from "../../utils/http";

const MedicalHistory = () => {
  const [reports, setReports] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editReport, setEditReport] = useState(null);


  const getHealthReport = () => {
    http.get('/health-report/view')
        .then((res) => {
          const reports = res.data.map((report, key) => ({
            id: key+1,
            _id: report._id,
            animalID: report.animalID,
            staffID: report.staffID,
            healthDescription: report.healthDescription,
            nextCheckupDate: report.nextCheckupDate,
            medication: report.medication,
            vaccineStatus: report.vaccineStatus,
          }));
          setReports(reports);
        })
        .catch((err) => console.log(err));
  }

  useEffect(() => {
    getHealthReport();
  },[])

  const handleAddReport = (event) => {
    event.preventDefault();
    http
      .post('/health-report/add', {
        animalID: event.target.animalID.value,
        staffID: event.target.staffID.value,
        healthDescription: event.target.healthDescription.value,
        nextCheckupDate: event.target.nextCheckupDate.value,
        medication: event.target.medication.value,
        vaccineStatus: event.target.vaccineStatus.value,
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
        getHealthReport(); // Refresh the products list
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
      animalID: document.getElementById("editAnimalId").value,
      staffID: document.getElementById("editStaffId").value,
      healthDescription: document.getElementById("editHealthDescription").value,
     nextCheckupDate: document.getElementById("editNextCheckupDate").value,
      medication: document.getElementById("editMedication").value,
      vaccineStatus: document.getElementById("editVaccinationStatus").value,
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
        Swal.fire('Success', 'Product updated successfully!', 'success');
      })
      .catch((err) => console.log(err));
  };

  
  // const handleDeleteReport = (index) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You will not be able to recover this report!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, delete it!",
  //     cancelButtonText: "No, cancel!",
  //     reverseButtons: true,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const newReports = [...reports];
  //       newReports.splice(index, 1);
  //       setReports(newReports);
  //       Swal.fire("Deleted!", "Your report has been deleted.", "success");
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       Swal.fire("Cancelled", "Your report is safe :)", "error");
  //     }
  //   });
  // };

  const handleDeleteReport = (_id) => {
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
          .delete(`/health-report/delete/${_id}`)
          .then((res) => {
            console.log(res);
            Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
            getHealthReport(); // Refresh the products list
          })
          .catch((err) => console.log(err));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your product is safe :)', 'error');
      }
    });
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
        title="MEDICAL HISTORY"
        subtitle="Manage medical history reports"
        fontSize="36px"
        mt="20px"
      />
      <Form onSubmit={handleAddReport}>
           <Box marginBottom="10px">
            <InputLabel >Animal Id</InputLabel>
                <TextField
                    placeholder="Input animal ID..."
                    name="animalID"
                    variant="filled"
                    fullWidth
                    required
                  />
            </Box>

        

            <Box marginBottom="10px">
            <InputLabel >Staff ID</InputLabel>
              <TextField
                  placeholder="Input staff ID..."
                  name="staffID"
                  variant="filled"
                  fullWidth
                  required
                />

            </Box>

            <Box marginBottom="10px">
        <InputLabel >Health Description</InputLabel>
          <TextField
              placeholder="Input health description..."
              name="healthDescription"
              variant="filled"
              fullWidth
              required
            />

        </Box>
        <Box marginBottom="10px">
        <InputLabel >Next Checkup Date</InputLabel>
          <TextField
              placeholder="Input next checkup date..."
              name="nextCheckupDate"
              variant="filled"
              fullWidth
              required
              type="date"
            />
        </Box>
        <Box marginBottom="10px">
        <InputLabel >Animal Medication</InputLabel>
          <TextField
              placeholder="Input animal medication..."
              name="medication"
              variant="filled"
              fullWidth
              required
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
                    <option value="">Select vaccination status</option>
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
            { field: "animalID", headerName: "Animal ID", flex: 1 },
            { field: "staffID", headerName: "Staff ID", flex: 1 },
            { field: "healthDescription", headerName: "Health Description", flex: 1 },
            { field: "nextCheckupDate", headerName: "Next Checkup Date", flex: 1 },
            { field: "medication", headerName: "Medication", flex: 1 },
            {
              field: "vaccineStatus",
              headerName: "Vaccination Status",
              flex: 1,
            },
            {
              field: "actions",
              headerName: "",
              sortable: false,
              filterable: false,
              renderCell: (params) => (
                <div style={{ marginTop: "5px auto" }}>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteReport(params.row._id)}
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
        <DialogTitle>Edit Report</DialogTitle>
        <DialogContent>
          <Form onSubmit={handleEditReport}>
            <Form.Group className="mb-3" controlId="editAnimalId">
              <Form.Label>Animal ID</Form.Label>
              <Form.Control
                placeholder="Enter animal ID"
                defaultValue={editReport ? editReport.animalID : ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editStaffId">
              <Form.Label>Staff ID</Form.Label>
              <Form.Control
                placeholder="Enter staff ID"
                defaultValue={editReport ? editReport.staffID : ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editHealthDescription">
              <Form.Label>Health Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter health description"
                defaultValue={editReport ? editReport.healthDescription : ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editNextCheckupDate">
              <Form.Label>Next Checkup Date</Form.Label>
              <Form.Control
                type="date"
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
