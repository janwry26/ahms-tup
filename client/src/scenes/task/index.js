import Header from "../../components/Header";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { Box,TextField } from "@mui/material";
import { Select, MenuItem,InputLabel } from "@mui/material";
import { useState,useEffect } from "react";
import "../../styles/loader.css"
function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [taskID, setTaskID] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskStatus, setTaskStatus] = useState("Not Complete"); // Set initial task status

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newTask || selectedStaffId === 0) return;
    const task = {
      taskID: taskID,
      userID: selectedStaffId,
      taskName: newTask,
      taskDueDate: taskDueDate,
      taskStatus: taskStatus,
    };
    setTasks([...tasks, task]);
    setNewTask("");
    setSelectedStaffId("");
    setTaskID("");
    setTaskDueDate("");
    setTaskStatus("Not Complete"); // Reset task status to "Not Complete" after submission
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks(tasks.filter((task) => task.taskID !== id));
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      }
    });
  };

  const handleUpdate = (id, newText) => {
    Swal.fire({
      title: "Update task",
      input: "text",
      text: "You can update your task by typing here!",
      icon: "info",
      inputValue: newText,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter a new task name!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks(
          tasks.map((task) =>
            task.taskID === id ? { ...task, taskName: result.value } : task
          )
        );
        Swal.fire("Updated!", "Your task has been updated.", "success");
      }
    });
  };

  const handleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.taskID === id
          ? {
              ...task,
              taskStatus: "Complete",
              taskAccomplishDate: new Date().toLocaleString(),
            }
          : task
      )
    );
  };

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
    <Box p="20px" width="80%" margin="0 auto" paddingTop="50px" className="reload-animation">
      <div>
        <Header
          title="TASK"
          subtitle="Managing task for staff"
          fontSize="36px"
          mt="20px"
        />
        <Form onSubmit={handleSubmit}>
           <Box mt={2}>
           <InputLabel >Task Name</InputLabel>
          <TextField
            fullWidth
            variant="filled"
            placeholder="Enter Task Name..."
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
          />
        </Box>
        <Box mt={2}>
        <InputLabel >Staff ID</InputLabel>

          <TextField
            fullWidth
            variant="filled"
            placeholder="Enter Staff ID..."
            value={selectedStaffId}
            onChange={(event) => setSelectedStaffId(event.target.value)}
            type="number"
          />
        </Box>
        <Box mt={2}>
        <InputLabel >Task ID</InputLabel>
          <TextField
            fullWidth
            variant="filled"
            placeholder="Enter Task ID"
            value={taskID}
            onChange={(event) => setTaskID(event.target.value)}
            type="number"
          />
        </Box>
        <Box mt={2}>
        <InputLabel >Due Date</InputLabel>
          <TextField
            fullWidth
            variant="filled"
            placeholder="Select Due Date"
            type="date"
            value={taskDueDate}
            onChange={(event) => setTaskDueDate(event.target.value)}
          />
        </Box>
        <Box mt={2}>
        <InputLabel >Task Status</InputLabel>

          <Select
            fullWidth
            variant="filled"
            placeholder="Select task status"
            value={taskStatus}
            onChange={(event) => setTaskStatus(event.target.value)}
          >
            <MenuItem value="Not Complete">Not Complete</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </Select>
        </Box>
        <Button
              className="btnDashBoard"
              type="submit"
              color="success"
              variant="success"
            >
              Create
            </Button>
        </Form>

        <h2 className="mt-4">TASK CREATED BELOW:</h2>

        {tasks.length > 0 && (
          <div className="mt-3">
            {tasks.map((task) => (
              <div
                key={task.taskID}
                className="d-flex justify-content-between align-items-center p-3 mb-3 shadow-sm"
              >
                <div>
                  <h4 style={{color:"rgb(119,213,203)"}}>{task.taskName}</h4>
                  <p>Assigned to Staff ID {task.userID}</p>
                  <p>Status: {task.taskStatus}</p>
                  <p>Due Date {task.taskDueDate} </p>
                  {task.taskAccomplishDate && (
                    <p>Completed on: {task.taskAccomplishDate}</p>
                  )}
                </div>
                <div>
                  {task.taskStatus !== "Complete" && (
                    <Button
                      variant="success"
                      onClick={() => handleComplete(task.taskID)}
                    >
                      Complete
                    </Button>
                  )}
                  <Button
                    variant="warning"
                    className="mx-2"
                    onClick={() =>
                      handleUpdate(task.taskID, task.taskName)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(task.taskID)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tasks.length === 0 && (
          <div className="mt-3">
            <p>No tasks have been added yet. Please add a task.</p>
          </div>
        )}
      </div>
    </Box>
  );
}

export default TaskList;
