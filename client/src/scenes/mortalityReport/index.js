import * as React from 'react';
import Modal from '@mui/material/Modal'; 
import { Form, Button } from "react-bootstrap";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField,InputLabel, Select,MenuItem } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaPlus, FaArchive, FaEdit } from "react-icons/fa";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import "../../styles/loader.css"
import "../../styles/rows.css"
import http from "../../utils/http";
import { format } from "date-fns";
import { formatDate } from "../../utils/formatDate";

const MortalityReport = () => {
  const [reports, setReports] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editReport, setEditReport] = useState(null);
  const [animalList, setAnimalList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [customCategory, setCustomCategory] = useState("");


  const [causeOfDeath, setCauseOfDeath] = useState("");
  const [causeOfDeathList, setCauseOfDeathList] = useState("");
  const [customCauseOfDeath, setCustomCauseOfDeath] = useState([]);
  
  const clearCustomInputs = () => { //Second for new page also
    setCustomCauseOfDeath("");
  }

  const getCategoriesData = async () => {
    await http.get('/categories/view')
    .then((res) => {
      console.log(res.data); //Third add as necessary
      setCauseOfDeathList(res.data[6].item);
    })
  }

  useEffect(() => {
    getCategoriesData();
  }, []) //For other page

  const handleCauseOfDeathChange = (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory === "Other") {
      setCauseOfDeath(selectedCategory);
    } else {
      setCauseOfDeath(selectedCategory);
      setCustomCategory("");
    }
  };
  const handleCustomCategoryChange = (event) => {
    setCustomCategory(event.target.value);
    setCategory("Other");
  };

  const handleAddCustomCategory = async (_id,_type,value) => {
    await http.post('/categories/add', {
        "categoryId": _id,
        "module": "Mortality",
        "type": _type,
        "item": [{
            "itemName": value
        }]
    }).then((res) => {
      if (res) {
        alert("Option Added Successfully");
        getCategoriesData();
        // setCategory(customCategory);
        clearCustomInputs();
      }
      
    }).catch((err) => {
      console.log(err);
    })

  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const getMortalityReport = () => {
    http.get('/mortality-report/view')
      .then((res) => {
        const reportPromises = res.data.map((report, key) => {
          const animalRequest = http.get(`/health-report/view/${report.animalID}`);
          const staffRequest = http.get(`/user/view/${report.staffID}`);
          const commonRequest =  http.get(`/animal/view/${report.animalID}`);
          const quantityRequest =  http.get(`/animal/view/${report.animalID}`);
          
          return Promise.all([animalRequest, staffRequest, commonRequest, quantityRequest])
            .then(([animalRes, staffRes, commonRes, quantityRes]) => {
              const nickname = animalRes.data.nickname;
              const staffName = `${staffRes.data.lastName}, ${staffRes.data.firstName}`;
              const commonName = commonRes.data.species;
              let quantity = quantityRes.data.quantity;
              
              if (reports.some((report) => report.commonName === commonName)) {
                // Subtract 1 from quantity if nickname is already in the table
                quantity -= 1;
              }
              
              return {
                id: key + 1,
                _id: report._id,
                animalID: report.animalID,
                staffID: report.staffID,
                quantity: quantity,
                nickname: nickname,
                commonName: commonName,
                staffName: staffName,
                casueOfDeath: report.casueOfDeath,
                deathDate: format(new Date(report.deathDate), "MMMM d, yyyy"),
                deathTime: report.deathTime,
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
  };
  

  const getAnimals = () => {
    
    http.get('/health-report/view')
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
    <Box m="20px" width="98%" margin="0 auto" >
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
      <InputLabel >Animal Name</InputLabel>
      <Select
          name="animalID"
          native
          fullWidth
          required
          variant="filled"
        >
          <option value="">Select an Animal</option>
          {animalList.map((val) => {
            const isAnimalInTable = reports.some((report) => report.nickname === val.nickname);
            if (isAnimalInTable) {
              return null; // Hide the option if the animal name is already in the table
            }
            return (
              <option value={val.animalID} key={val.animalID}>
                {val.nickname}
              </option>
            );
          })}
        </Select>

      </Box>
          
      <Box marginBottom="10px">
               <InputLabel>Cause Of Death</InputLabel>
                  <Select
                    name="casueOfDeath"
                    native
                    fullWidth
                    required
                    variant="filled"
                    value={causeOfDeath} //Sixth
                    onChange={handleCauseOfDeathChange} //Seventh
                  >
                    <option value="">Select Cause Of Death</option>
                    {causeOfDeathList.map((val) => { //Eigth mapping for the list
                      return (
                        <option key={val.itemId} value={val.itemName}>{val.itemName}</option>
                      )
                    })}
                    <option value="Other">Other</option>                    
                  </Select>

                  {/* Nineth Copy paste and change value, onchange, onClick */}
                  {causeOfDeath === "Other" && (
                    <TextField
                      label="Custom Category"
                      value={customCauseOfDeath}
                      onChange={(e) => {
                        setCustomCauseOfDeath(e.target.value);
                        setCauseOfDeath("Other");
                      }}
                      fullWidth
                      required
                      variant="filled"
                    />
                  )}
                  {causeOfDeath === "Other" && (
                    <Button className='btnDashBoard' onClick={()=>handleAddCustomCategory(12,"Cause Of Death",customCauseOfDeath)}>
                      Add Category
                    </Button>
                  )}
                  {/* Nineth Copy paste and change value, onchange, onClick */}
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
                  <p>Remaining Number Of Animals : <span>{selectedRow.quantity}</span></p>
                  <p>Cause of Death : <span>{selectedRow.casueOfDeath}</span></p>
                  <p>Death Date: <span>{selectedRow.deathDate}</span></p>
                  <p>Time of Death: <span>{selectedRow.deathTime}</span></p>
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
            { field: "nickname", headerName: "Animal Name", flex: 1 },
            { field: "commonName", headerName: "Animal Name", flex: 1 },
            { field: "quantity", headerName: "Remaining number of animals", flex: 1 },
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
                  <option value={val.animalID} key={val.animalID}>{val.nickname}</option>
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
              <Form.Label>Date of</Form.Label>
              <Form.Control
                type="date"
                defaultValue={editReport ? formatDate(editReport.deathDate) : ""}
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
{/* 
            <Form.Group className="mb-3" controlId="editDateReported">
              <Form.Label>Date Reported</Form.Label>
              <Form.Control
                type="date"
                defaultValue={editReport ? editReport.dateReported : ""}
                required
              />
            </Form.Group> */}
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
