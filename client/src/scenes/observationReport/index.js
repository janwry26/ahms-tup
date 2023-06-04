
import { Form, Button } from "react-bootstrap";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField,InputLabel,Select } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaPlus, FaArchive, FaEdit } from "react-icons/fa";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState,useEffect } from "react";
import "../../styles/loader.css"
import http from "../../utils/http";
import { formatDate } from "../../utils/formatDate";


const ObservationReport = () => {
  const [reports, setReports] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editReport, setEditReport] = useState(null);
  const [animalList, setAnimalList] = useState([]);
  const [staffList, setStaffList] = useState([]);

   const getObservationReport = () => {
    http.get('/observation-report/view')
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
              reportDescription: report.reportDescription,
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
    getObservationReport();
    getAnimals();
    getStaffs();
  },[])

  const handleAddReport = (event) => {
    event.preventDefault();
    http
      .post('/observation-report/add', {
        animalID: event.target.animalID.value,
        staffID: event.target.staffID.value,
        reportDescription: event.target.reportDescription.value,
        dateReported: event.target.dateReported.value,
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
        getObservationReport(); // Refresh the products list
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
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        http
          .delete(`/observation-report/delete/${_id}`)
          .then((res) => {
            console.log(res);
            Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
            getObservationReport(); // Refresh the products list
          })
          .catch((err) => console.log(err));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your product is safe :)', 'error');
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
      animalName: document.getElementById("editAnimalName").value, // Update animalID instead of animalName
      staffName: document.getElementById("editStaffName").value,
      reportDescription: document.getElementById("editReportDescription").value,
      dateReported: document.getElementById("editDateReported").value,
    };
  
    http
      .put(`/observation-report/edit/${editReport._id}`, editedReport)
      .then((res) => {
        const updatedReports = reports.map((report) =>
          report._id === editReport._id ? { ...report, ...editedReport } : report
        );
        setReports(updatedReports);
        setEditDialogOpen(false);
        Swal.fire('Success', 'Product updated successfully!', 'success').then(()=>window.location.reload());
      })
      .catch((err) => console.log(err));
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
    <Box m="20px" width="80%" margin="0 auto" className="reload-animation">
      <Header
        title="OBSERVATION REPORT"
        subtitle="Manage observation reports"
        fontSize="36px"
        mt="20px"
      />
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
            <option value="" >Select an Animal</option>
            {animalList.map((val) => {
                return (
                  <option value={val.animalID} key={val.animalID}>{val.animalName}</option>
                )
            })}          
          </Select>
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
        { field: "animalName",headerName: "Animal Name", flex: 1 },

        { field: "staffName", headerName: "Staff Name", flex: 1 },  
        { field: "reportDescription", headerName: "Description", flex: 1 },
        { field: "dateReported", headerName: "Date Reported", flex: 1 },  
         { 
          field: "actions",
           headerName: "Actions", 
            sortable: false, 
             filterable: false, 
              renderCell: (params) => 
              (<div> 
               <Button  className="btn btn-sm mx-1" variant="primary" onClick={() => handleDeleteReport(params.row._id)}>
                 <FaArchive />
                  </Button> 
                <Button  variant="warning" size="sm" onClick={() => handleEditDialogOpen(params.row)}>
                <FaEdit />
              </Button>
            </div>
          ),
          flex: 0.3,
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
        <InputLabel >Animal</InputLabel>
        <Select
            id="editAnimalName"
            defaultValue={editReport ? editReport.animalID : ""}
            native
            fullWidth
            required
            variant="filled"
          >
            <option value="" >Select an Animal</option>
            {animalList.map((val) => {
                return (
                  <option value={val.animalID} key={val.animalID}>{val.animalName}</option>
                )
            })}          
          </Select>
    </Box>
    <Form.Group className="mb-3" controlId="editReportDescription">
         
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