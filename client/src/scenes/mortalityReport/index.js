import { Form, Button } from "react-bootstrap";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField,InputLabel, Select } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import "../../styles/loader.css"
const MortalityReport = () => {
  const [reports, setReports] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editReport, setEditReport] = useState(null);

  const handleAddReport = (event) => {
    event.preventDefault();
    const report = {
      id: Date.now(),
      animalID: event.target.animalID.value,
      staffID: event.target.staffID.value,
      causeOfDeath: event.target.causeOfDeath.value,
      deathDate: event.target.deathDate.value,
      deathTime: event.target.deathTime.value,
      dateReported: event.target.dateReported.value,
    };
    setReports([...reports, report]);
    event.target.reset();
  };

  const handleDeleteReport = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this report!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const newReports = [...reports];
        newReports.splice(index, 1);
        setReports(newReports);
        Swal.fire("Deleted!", "Your report has been deleted.", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your report is safe :)", "error");
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
    const newReports = reports.map((report) => {
      if (report.id === editReport.id) {
        return {
          ...report,
          animalID: document.getElementById("editAnimalID").value,
          staffID: document.getElementById("editStaffID").value,
          causeOfDeath: document.getElementById("editCauseOfDeath").value,
          deathDate: document.getElementById("editDeathDate").value,
          deathTime: document.getElementById("editDeathTime").value,
          dateReported: document.getElementById("editDateReported").value,
        };
      }
      return report;
    });
    setReports(newReports);
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
    <Box m="20px" width="80%" margin="0 auto" >
      <Header
        title="MORTALITY REPORT"
        subtitle="Manage mortality reports"
        fontSize="36px"
        mt="20px"
      />
      <Form onSubmit={handleAddReport}>
      <Box marginBottom="10px">
      <InputLabel >Animal ID</InputLabel>
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
        <InputLabel >Staff ID</InputLabel>
          <TextField
              placeholder="Input staff ID..."
              name="staffID"
              variant="filled"
              fullWidth
              required
              type="number"
            />

        </Box>
        <Box marginBottom="10px">
          <InputLabel >Cause of Death</InputLabel>
          <TextField
              placeholder="Input cause of death..."
              name="causeOfDeath"
              variant="filled"
              fullWidth
              required
            />
          </Box>  

          <Box marginBottom="10px">
          <InputLabel >Death Date</InputLabel>
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
          <InputLabel >Death Time</InputLabel>
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
  

        <div className="d-grid gap-2" style={{ marginTop: "-20px", marginBottom: "20px" }}>
          <Button className="btnDashBoard" type="submit">
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
            { field: "causeOfDeath", headerName: "Cause of Death", flex: 1 },
            { field: "deathDate", headerName: "Death Date", flex: 1 },
            { field: "deathTime", headerName: "Death Time", flex: 1 },
            {
              field: "dateReported",
              headerName: "Date Reported",
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
                    onClick={() => handleDeleteReport(params.rowIndex)}
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
            <Form.Group className="mb-3" controlId="editAnimalID">
              <Form.Label>Animal ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter animal ID"
                defaultValue={editReport ? editReport.animalID : ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editStaffID">
              <Form.Label>Staff ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter staff ID"
                defaultValue={editReport ? editReport.staffID : ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editCauseOfDeath">
              <Form.Label>Cause of Death</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter cause of death"
                defaultValue={editReport ? editReport.causeOfDeath : ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editDeathDate">
              <Form.Label>Death Date</Form.Label>
              <Form.Control
                type="date"
                defaultValue={editReport ? editReport.deathDate : ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editDeathTime">
              <Form.Label>Death Time</Form.Label>
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
