import * as React from 'react';
import Modal from '@mui/material/Modal';
import { Form, Button } from "react-bootstrap";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField,InputLabel,Select} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaPlus, FaArchive, FaEdit } from "react-icons/fa";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState,useEffect } from "react";
import "../../styles/loader.css"
import "../../styles/rows.css"
import http from "../../utils/http";
import { format } from "date-fns";
import { formatDate } from "../../utils/formatDate";


const ObservationReport = () => {
  const [reports, setReports] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editReport, setEditReport] = useState(null);
  const [animalList, setAnimalList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [habitatList, setHabitatList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [selectedAnimalID, setSelectedAnimalID] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false); 

   const getObservationReport = () => {
    http.get('/observation-report/view')
    .then((res) => {
      const reportPromises = res.data.map((report, key) => {
        const animalRequest = http.get(`/animal/view/${report.animalID}`);
        const staffRequest = http.get(`/user/view/${report.staffID}`);
        const habitatRequest = http.get(`/animal/view/${report.animalID}`);

        return Promise.all([animalRequest, habitatRequest,staffRequest])
          .then(([animalRes,habitatRes, staffRes]) => {
            const species = animalRes.data.species;
            const staffName = `${staffRes.data.lastName}, ${staffRes.data.firstName}`;
            const habitat = habitatRes.data.habitat
            return {
               id: key+1,
              _id: report._id,
              animalID: report.animalID,
              staffID: report.staffID,
              habitat: habitat,
              species:species,
              staffName: staffName,
              reportDescription: report.reportDescription,
              dateReported: format(new Date(report.dateReported), "MMMM d, yyyy"),
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
  const getHabitat = () => {
    
    http.get('/animal/view')
        .then((res) => {
          setHabitatList(res.data);
        })
        .catch((err) => console.log(err));
  }

  const getStaffs = () => {
    http.get('/user/view')
      .then((res) => {
        setStaffList(res.data);
      })
      .catch((err) => console.log(err));
  };
  
  
  useEffect(() => {
    getObservationReport();
    getAnimals();
    getHabitat();
    getStaffs();
  },[])

  const handleAddReport = (event) => {
    event.preventDefault();
    http
      .post('/observation-report/add', {
        animalID: event.target.animalID.value,
        staffID: event.target.staffID.value,
        reportDescription: event.target.reportDescription.value,
        dateReported: new Date().toLocaleDateString("en-US", { 
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
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
        getObservationReport(); // Refresh the products list
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
          .put(`/observation-report/archive/${_id}`)
          .then((res) => {
            console.log(res);
            Swal.fire('Archive!', 'Your report has been archived.', 'success');
            getObservationReport(); // Refresh the products list
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
      animalName: document.getElementById("editAnimalName").value, // Update animalID instead of animalName
      staffName: document.getElementById("editStaffName").value,
      reportDescription: document.getElementById("editReportDescription").value,
      // dateReported: document.getElementById("editDateReported").value,
    };
  
    http
      .put(`/observation-report/edit/${editReport._id}`, editedReport)
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
    <Box m="20px" width="98%" margin="0 auto" className="reload-animation">
      <Header
        title="OBSERVATION REPORT"
        subtitle="Manage observation reports"
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
        <InputLabel >Report Description</InputLabel>
          <TextField
              placeholder="Input report Description..."
              name="reportDescription"
              variant="filled"
              fullWidth
              required
            />
    </Box>

    {/* <Box marginBottom="10px">
        <InputLabel >Date Reported</InputLabel>
          <TextField
              name="dateReported"
              variant="filled"
              fullWidth
              required
              type="date" 
            />
    </Box> */}

    <div className="d-grid gap-2" style={{marginTop:"-20px", marginBottom: "20px"}}>
      <Button className="btnDashBoard"  type="submit"  >
        <FaPlus /> Add Report
      </Button>
    </div>
  </Form>
  </Box>
   </Modal>
  <Box
    m="40px 0 0 0"
    height="75vh"
    margin= "0 auto"
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
            <p>Report Description: <span>{selectedRow.reportDescription}</span></p>
            <p>Date Reported: <span>{selectedRow.dateReported}</span></p>
            <p>Staff Name : <span>{selectedRow.staffName}</span></p>
           
              
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
        { field: "species",headerName: "Common Name", flex: 1 },
        { field: "habitat", headerName: "Habitat", flex: 1 },
        { field: "reportDescription", headerName: "Description", flex: 1 },
        { field: "dateReported", headerName: "Date Reported", flex: 1 },  
        { field: "staffName", headerName: "Reported By", flex: 1 },  
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
        <InputLabel >Animal</InputLabel>
        <Select
            id="editAnimalName"
            defaultValue={editReport ? editReport.animalID : ""}
            native
            fullWidth
            required
            variant="filled"
            disabled
          >
            <option value="" >Select Common Name Of Animal</option>
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