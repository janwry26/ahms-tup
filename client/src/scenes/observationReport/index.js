import { Form, Button } from "react-bootstrap";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField,InputLabel } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState,useEffect } from "react";
import "../../styles/loader.css"
import http from "../../utils/http";


const ObservationReport = () => {
  const [reports, setReports] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editReport, setEditReport] = useState(null);

  const getObservationReport = () => {
    http.get('/observation-report/view')
        .then((res) => {
          const reports = res.data.map((report, key) => ({
            id: key+1,
            _id: report._id,
            animalID: report.animalID,
            staffID: report.staffID,
            reportDescription: report.reportDescription,
            dateReported: report.dateReported,
          }));
          setReports(reports);
        })
        .catch((err) => console.log(err));
  }

  useEffect(() => {
    getObservationReport();
  },[])

  const handleAddReport = (event) => {
    event.preventDefault();
    const report = {
      id: Date.now(),
      animalID: event.target.animalID.value,
      staffID: event.target.staffID.value,
      reportDescription: event.target.reportDescription.value,
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
          reportDescription: document.getElementById("editReportDescription").value,
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
    <Box m="20px" width="80%" margin="0 auto" className="reload-animation">
      <Header
        title="OBSERVATION REPORT"
        subtitle="Manage observation reports"
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
        <InputLabel >Report Description</InputLabel>
          <TextField
              placeholder="Input report Description..."
              name="reportDescription"
              variant="filled"
              fullWidth
              required
            />
    </Box>

    <Box marginBottom="10px">
        <InputLabel >Date Reported</InputLabel>
          <TextField
              name="dateReported"
              variant="filled"
              fullWidth
              required
              type="date" 
            />
    </Box>

    <div className="d-grid gap-2" style={{marginTop:"-20px", marginBottom: "20px"}}>
      <Button className="btnDashBoard"  type="submit"  >
        <FaPlus /> Add Report
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
      rows={reports}
      columns={[ 
        { field: "animalID",headerName: "Animal ID", flex: 1 },

        { field: "staffID", headerName: "Staff ID", flex: 1 },  
        { field: "reportDescription", headerName: "Description", flex: 1 },
        { field: "dateReported", headerName: "Date Reported", flex: 1 },  
         { 
          field: "actions",
           headerName: "Actions", 
            sortable: false, 
             filterable: false, 
              renderCell: (params) => 
              (<div style={{ margintop: '5px auto' }} > 
               <Button   variant="danger" onClick={() => handleDeleteReport(params.row._id)}>
                 <FaTrash />
                  </Button> 
                <Button  variant="primary"  onClick={() => handleEditDialogOpen(params.row)}>
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

        <Form.Group className="mb-3" controlId="editReportDescription">
          <Form.Label>Report Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter report description"
            defaultValue={editReport ? editReport.reportDescription : ""}
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
      <Button variant="success"  color="danger"onClick={handleEditDialogSave} type="submit">
        Save
      </Button>
    </DialogActions>
  </Dialog>
</Box>
);
};

export default ObservationReport;