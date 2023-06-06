import * as React from 'react';
import Modal from '@mui/material/Modal';
import { Form, Button } from "react-bootstrap";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField,InputLabel,Select } from "@mui/material";
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


const Task = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [animalList, setAnimalList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getTasks = () => {
    http.get('/task/view')
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
              taskDueDate: formatDate(task.taskDueDate),
              taskStatus: task.taskStatus, 
              taskAccomplishDate: task.taskAccomplishDate
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
    getAnimals();
    getStaffs();
    getTasks();
  },[])

  const handleAddTask = async (event) => {
    const {
      taskName,
      staffId,
      taskDescription,
      taskDueDate
    } = event.target;
  
    await http
      .post('/task/add', {
        taskName: taskName.value,
        staffID: staffId.value,
        taskDescription: taskDescription.value,
        taskDueDate: taskDueDate.value,
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

      event.target.reset();
  };
  

  const handleArchive = (_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this task!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        http
          .put(`/task/archive/${_id}`)
          .then((res) => {
            Swal.fire('Deleted!', 'Task has been deleted.', 'success');
            getTasks(); // Refresh the products list
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
      staffName: document.getElementById("editStaffName").value, 
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
        Swal.fire('Success', 'Product updated successfully!', 'success');
        getTasks();
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
    <Box m="20px" width="80%" margin="0 auto" className="reload-animation">
      <Header
        title="Task Management"
        subtitle="Manage Task Pages"
        fontSize="36px"
        mt="20px"
      />
       <Button onClick={handleOpen} className="btn btn-color" >Open Form</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
    <Form onSubmit={handleAddTask}>
    <Box marginBottom="10px">
          <InputLabel >Task Name</InputLabel>
            <TextField
                placeholder="Input Task Name..."
                name="taskName"
                variant="filled"
                fullWidth
                required
              />
      </Box>

        <Box marginBottom="10px">
        <InputLabel>Staff</InputLabel>
              <Select
                name="staffId"
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
            <InputLabel >Task Description</InputLabel>
              <TextField
                  placeholder="Input Task Description..."
                  name="taskDescription"
                  variant="filled"
                  fullWidth
                  required
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
                />
        </Box>

        <div className="d-grid gap-2" style={{marginTop:"-20px", marginBottom: "20px"}}>
          <Button className="btnDashBoard"  type="submit"  >
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
      rows={tasks}
      columns={[ 
        { field: "id",headerName: "#", flex: 0.3 },
        { field: "taskName",headerName: "Task Name", flex: 1 },
        { field: "staffName", headerName: "Staff Name", flex: 1 },  
        { field: "taskDescription", headerName: "Task Description", flex: 1 },
        { field: "taskDueDate", headerName: "Due Date", flex: 0.7 },  
        { field: "taskStatus", headerName: "Task Status", flex: 1 },  
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
              <Button  variant="success" size="sm" onClick={() => handleEditDialogOpen(params.row)}>
                <HowToRegIcon />
              </Button>
            </div>
          ),
          flex: 0.6,
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

      <Form.Group className="mb-3" controlId="editTaskStaffName">
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
        </Form.Group>

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
            defaultValue={editTask ? editTask.taskDueDate : ""}
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