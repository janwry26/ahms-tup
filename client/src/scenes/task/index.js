import * as React from 'react';
import Modal from '@mui/material/Modal';
import { Form, Button } from "react-bootstrap";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField,InputLabel,Select,MenuItem,Input} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaPlus, FaArchive, FaEdit } from "react-icons/fa";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState,useEffect } from "react";
import "../../styles/loader.css"
import http from "../../utils/http";
import { formatDate } from "../../utils/formatDate";
import jwtDecode from 'jwt-decode';
import { format } from "date-fns";
import "../../styles/rows.css"

const Task = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [animalList, setAnimalList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [currentDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [staffSearchTerm, setStaffSearchTerm] = useState('');

  const [task, setTask] = useState("");

  const [taskList, setTaskList] = useState([]);

  const [customTask, setCustomTask] = useState("");

  const clearCustomInputs = () => { //Second for new page also
    setCustomTask("");
  }

  const getCategoriesData = async () => {
    await http.get('/categories/view')
    .then((res) => {
      console.log(res.data); //Third add as necessary
      setTaskList(res.data[5].item);
    })
  }

  useEffect(() => {
    getCategoriesData();
  }, []) //For other page

  const handleTaskChange = (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory === "Other") {
      setTask(selectedCategory);
    } else {
      setTask(selectedCategory);
      setCustomTask("");
    }
    
  };

  const handleAddCustomCategory = async (_id,_type,value) => {
    await http.post('/categories/add', {
        "categoryId": _id,
        "module": "Task Name",
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


  const [currentUser, setCurrentUser] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  let decoded;
  let admin;
  let stid;
  
 

  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    decoded = jwtDecode(token);
    setCurrentUser(decoded);
    if (decoded.username === "Admin" || decoded.username === "Super Admin") {
      setIsAdmin(true);
      admin = true;
      getTasks();
    } else {
      setIsAdmin(false);
      admin = false;

      http.get(`/user/view-staff/${decoded._id}`)
        .then((res) => {
          stid = res.data.staffId;
          getTasks();
        })
        .catch((err) => console.log(err));
    }
  }

  const getTasksAdmin = () => {
    http.get(`task/view`)
    .then((res) => {
      const requestPromises = res.data.map((task, key) => {
        const staffRequest = http.get(`/user/view/${task.staffID}`);

        return Promise.all([staffRequest])
          .then(([staffRes]) => {
            const staffName = `${staffRes.data.lastName}, ${staffRes.data.firstName}`;

            return {
              id: key+1,
              _id: task._id,
              taskName: task.taskName,
              staffId: task.staffID,
              staffName: staffName,
              taskDescription: task.taskDescription,
              taskDueDate: format(new Date(task.taskDueDate), "MMMM d, yyyy"),
              taskStatus: task.taskStatus, 
              taskAccomplishDate: task.taskAccomplishDate == "" || task.taskAccomplishDate == null ? "" : format(new Date(task.taskAccomplishDate), "MMMM d, yyyy"),
            };
          });
      });

      Promise.all(requestPromises)
        .then((task) => {
          setTasks(task);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  }

  const getTasksUser = () => {
    http.get(`task/view-user/${stid}`)
    .then((res) => {
      const requestPromises = res.data.map((task, key) => {
        const staffRequest = http.get(`/user/view/${task.staffID}`);

        return Promise.all([staffRequest])
          .then(([staffRes]) => {
            const staffName = `${staffRes.data.lastName}, ${staffRes.data.firstName}`;

            return {
              id: key+1,
              _id: task._id,
              taskName: task.taskName,
              staffId: task.staffID,
              staffName: staffName,
              taskDescription: task.taskDescription,
              taskDueDate: format(new Date(task.taskDueDate), "MMMM d, yyyy"),
              taskStatus: task.taskStatus, 
              taskAccomplishDate: task.taskAccomplishDate == "" || task.taskAccomplishDate == null ? "" : formatDate(task.taskAccomplishDate)
            };
          });
      });

      Promise.all(requestPromises)
        .then((task) => {
          setTasks(task);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  }

  const getTasks = async () => {
    await http.put(`task/overdue/${stid}`);
    admin ? getTasksAdmin() : getTasksUser();   
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
    const fetchData = async () => {
      await getAnimals();
      await getStaffs();
      await getCurrentUser();
    };
    
    fetchData();
  }, []);

  const [inputValues, setInputValues] = useState({});

  const handleAddTaskInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const handleAddTask = async () => {

    await http
      .post('/task/add', {
        taskName: task,
        staffID: inputValues.staffID,
        taskDescription: inputValues.taskDescription,
        taskDueDate: inputValues.taskDueDate,
        taskStatus: "Pending",
        taskAccomplishDate: ""
      })
      .then((res) => {
        handleClose();
        Swal.fire({
          title: 'Success',
          text: "Task added successfully",
          icon: 'success',
          timer: 700, // Show the alert for 2 seconds
          showConfirmButton: false
        })
      })
      .catch((err) => console.log(err));
      
  };
  

  const handleArchive = (_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this task!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, archive it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        http
          .put(`/task/archive/${_id}`)
          .then((res) => {
            Swal.fire('Success', 'Task archived successfully!', 'success').then(()=>window.location.reload());
          })
          .catch((err) => console.log(err));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your task is safe :)', 'error');
      }
    });
  };

  const handleEditReport = (params, event) => {
    const { id, field, props } = params;
    const { value } = event.target;
    const newTasks = tasks.map((report) => {
      if (report.id === id) {
        return { ...report, [field]: value };
      }
      return tasks;
    });
    setTasks(newTasks);
  };

  const handleEditDialogOpen = (tasks) => {
    setEditTask(tasks);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditDialogSave = () => {
    const editedTask = {
      _id: document.getElementById("editHiddenId").value,
      taskName: document.getElementById("editTaskName").value,
      // staffName: document.getElementById("editStaffName").value, 
      taskDescription: document.getElementById("editTaskDescription").value,
      taskDueDate: document.getElementById("editTaskDueDate").value,
      // taskStatus: document.getElementById("editTaskStatus").value,
      // taskAccomplishDate: document.getElementById("editTaskAccomplishDate").value,
    };
  
    http
      .put(`/task/edit/${editedTask._id}`, editedTask)
      .then((res) => {
        const updatedTasks = tasks.map((task) =>
          tasks._id === editTask._id ? { ...task, ...editedTask } : task
        );
        setTasks(updatedTasks);
        setEditDialogOpen(false);
        Swal.fire('Success', 'Task updated successfully!', 'success').then(() => window.location.reload());
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateStatus = (status, _id) => {
    let updatedStatus;
    status != "Completed" ? updatedStatus = "Completed" : updatedStatus = "Pending";

    Swal.fire({
      title: 'Are you sure?',
      text: 'Task will be mark as completed!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        http
          .put(`/task/edit-status/${_id}`, {
            taskStatus: updatedStatus,
          })
          .then((res) => {
            console.log(res);
            Swal.fire('Success', 'Task updated successfully!', 'success').then(() => window.location.reload());
            
          })
          .catch((err) => console.log(err));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your task is safe :)', 'error');
      }
    });
    
  }
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
        title="Task Management"
        subtitle="Manage Task Pages"
        fontSize="36px"
        mt="20px"
      />
       {isAdmin &&
       <Button onClick={handleOpen} className="btn btn-color" >Create Task</Button>
        }
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
    <Form>

    {/* <Box marginBottom="10px">
      <InputLabel>Task Name</InputLabel>
      <Select
        name="taskName"
        variant="filled"
        fullWidth
        required
        selectEmpty
      >
        {menuItems.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </Box> */}
{/* 
    <Box marginBottom="10px">
      <InputLabel>Add task name</InputLabel>
      <TextField
        variant='filled'
        value={newOption}
        onChange={(e) => setNewOption(e.target.value)}
        fullWidth
      />
      <Button onClick={handleAddOption} type="button" className="btnDashBoard btn-success my-2">
        Add Option
      </Button>
    </Box> */}

          <Box marginBottom="10px">
               <InputLabel>Task Name</InputLabel>
                  <Select
                    name="taskName"
                    native
                    fullWidth
                    required
                    variant="filled"
                    value={task} //Sixth
                    onChange={handleTaskChange} //Seventh
                  >
                    <option value="">Select Task Name</option>
                    {taskList.map((val) => { //Eigth mapping for the list
                      return (
                        <option key={val.itemId} value={val.itemName}>{val.itemName}</option>
                      )
                    })}
                    <option value="Other">Other</option>                    
                  </Select>

                  {/* Nineth Copy paste and change value, onchange, onClick */}
                  {task === "Other" && (
                    <TextField
                      label="Custom Category"
                      value={customTask}
                      onChange={(e) => {
                        setCustomTask(e.target.value);
                        setTask("Other");
                      }}
                      fullWidth
                      required
                      variant="filled"
                    />
                  )}
                  {task === "Other" && (
                    <Button className='btnDashBoard' onClick={()=>handleAddCustomCategory(10,"Task Name",customTask)}>
                      Add Category
                    </Button>
                  )}
                  {/* Nineth Copy paste and change value, onchange, onClick */}
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
    onChange={handleAddTaskInputChange}
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
            <InputLabel >Task Description</InputLabel>
              <TextField
                  placeholder="Input Task Description..."
                  name="taskDescription"
                  variant="filled"
                  fullWidth
                  required
                  onChange={handleAddTaskInputChange}
                />
        </Box>

        <Box marginBottom="10px">
            <InputLabel >Task Due Date</InputLabel>
              <TextField
                  name="taskDueDate"
                  placeholder="Input Task Description..."
                  variant="filled"
                  fullWidth
                  required
                  type="date" 
                  inputProps={{ min: currentDate }}
                  onChange={handleAddTaskInputChange}
                />
        </Box>

        <div className="d-grid gap-2" style={{marginTop:"-20px", marginBottom: "20px"}}>
          <Button className="btnDashBoard"  type="button" onClick={handleAddTask} >
            <FaPlus /> Add Task
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
    <DialogTitle>Full Details</DialogTitle>
    <DialogContent>
      <p>Task Name: <span>{selectedRow.taskName}</span></p>
      <p>Staff Name: <span> {selectedRow.staffName}</span></p>
      <p>Task Description: <span>{selectedRow.taskDescription}</span></p>
      <p>Task Due Date: <span> {selectedRow.taskDueDate} </span></p>
      <p>Task Status: <span>{selectedRow.taskStatus}</span></p>
      <p>Task Accomplised Date: <span>{selectedRow.taskAccomplishDate}</span></p>
      
    </DialogContent>
  </Dialog>
)}

    {isAdmin && <DataGrid
      rows={tasks}
      onCellClick={(params, event) => {
        if (event.target.classList.contains('MuiDataGrid-cell')) {
          setSelectedRow(params.row);
        }
      }}
      columns={[ 
        { field: "id",headerName: "#", flex: 0.3 },
        { field: "taskName",headerName: "Task Name", flex: 1 },
        { field: "staffName", headerName: "Staff Name", flex: 1 },
        { field: "taskDescription", headerName: "Task Description", flex: 1 },
        { field: "taskDueDate", headerName: "Due Date", flex: 0.7 },  
        { field: "taskStatus", headerName: "Task Status", flex: 1 },
        { field: "taskAccomplishDate", headerName: "Task Accomplish Date", flex: 1 },
         { 
          field: "actions",
           headerName: "Actions", 
            sortable: false, 
             filterable: false, 
              renderCell: (params) => 
              (<div> 
                <Button  className="btn btn-sm mx-1" variant="primary" onClick={() => handleArchive(params.row._id)}>
                 <FaArchive />
                </Button>
                <Button className="mx-1" variant="warning" size="sm" onClick={() => handleEditDialogOpen(params.row)}>
                  <FaEdit />
                </Button>
            </div>
          ),
          flex: 0.6,
        },
      ]}
      components={{ Toolbar: GridToolbar }}
    />}
    {!isAdmin && <DataGrid
      rows={tasks}
      columns={[ 
        { field: "id",headerName: "#", flex: 0.3 },
        { field: "taskName",headerName: "Task Name", flex: 1 },
        { field: "taskDescription", headerName: "Task Description", flex: 1 },
        { field: "taskDueDate", headerName: "Due Date", flex: 0.7 },  
        { field: "taskStatus", headerName: "Task Status", flex: 1 },
        { field: "taskAccomplishDate", headerName: "Task Accomplish Date", flex: 1 },
         { 
          field: "actions",
           headerName: "Actions", 
            sortable: false, 
             filterable: false, 
              renderCell: (params) => 
              (<div> 
                <Button disabled={params.row.taskStatus === "Completed"} variant="success" size="sm" onClick={() => handleUpdateStatus(params.row.taskStatus, params.row._id)}>
                  <HowToRegIcon />
                </Button>
            </div>
          ),
          flex: 0.6,
        },
      ]}
      components={{ Toolbar: GridToolbar }}
    />}
  </Box>

  {/* Edit Dialog */}
  <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
    <DialogTitle>Edit Report</DialogTitle>
    <DialogContent>
      <Form onSubmit={handleEditReport}>
      <Form.Control
          id='editHiddenId'
          type='hidden'
          defaultValue={editTask ? editTask._id : ""}
        />
  
      <Form.Group className="mb-3" controlId="editTaskName">
        <Form.Label>Task Name</Form.Label>
        <Form.Control
          type='text'
          placeholder="Enter task name"
          defaultValue={editTask ? editTask.taskName : ""}
          required
        />
      </Form.Group>

      {/* <Form.Group className="mb-3" controlId="editTaskStaffName">
        <InputLabel>Staff</InputLabel>
        <Select
          id="editStaffName"
          native
          fullWidth
          required
          defaultValue={editTask ? editTask.staffId : ""}
          variant="filled"
        >
          <option value="" >Select a Staff</option>
          {staffList.map((val) => {
              return (
                <option value={val.staffId} key={val.staffId}>{val.lastName + ', ' + val.firstName}</option>
              )
          })}          
        </Select>
        </Form.Group> */}

        <Form.Group className="mb-3" controlId="editTaskDescription">
          <Form.Label>Task Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter task description"
            defaultValue={editTask ? editTask.taskDescription : ""}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="editTaskDueDate">
          <Form.Label>Due Date</Form.Label>
          <Form.Control
            type="date"
            defaultValue={editTask ? formatDate(editTask.taskDueDate) : ""}
            min={currentDate}
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

export default Task;