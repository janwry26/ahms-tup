import { useState, useEffect } from "react";
import { Box, Typography,Modal,InputLabel,Button,TextField } from "@mui/material";
import http from "../../utils/http";
import { DataGrid } from "@mui/x-data-grid";
import { formatDate } from "../../utils/formatDate";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import "../../styles/loader.css"
import VisibilityIcon from "@mui/icons-material/Visibility";


const ViewCompletedTasks = () => {
    const [tasks, setTasks] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isLoading, setIsLoading] = useState(true); 
    const [isModalVisible, setIsModalVisible] = useState(false); // New state for modal visibility
    const [selectedHistory, setSelectedHistory] = useState(null);

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
  useEffect(() => {
    const getCompletedTasks = () => {
        http.get(`task/view`)
          .then((res) => {
            const completedTasks = res.data
              .filter((task) => task.taskStatus === "Completed")
              .map((task, key) => {
                const staffRequest = http.get(`/user/view/${task.staffID}`)
                  .then((staffRes) => {
                    const staffName = `${staffRes.data.lastName}, ${staffRes.data.firstName}`;
      
                    return {
                      id: key + 1,
                      _id: task._id,
                      taskName: task.taskName,
                      staffId: task.staffID,
                      staffName: staffName,
                      taskDescription: task.taskDescription,
                      taskDueDate: formatDate(task.taskDueDate),
                      taskStatus: task.taskStatus,
                      taskAccomplishDate: task.taskAccomplishDate === "" || task.taskAccomplishDate === null
                        ? ""
                        : formatDate(task.taskAccomplishDate),
                    };setselected
                  })
                  .catch((err) => console.log(err));
      
                return staffRequest;
              });
      
            Promise.all(completedTasks)
              .then((tasks) => {
                setTasks(tasks);
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      };
      
    getCompletedTasks();
  }, []);

  const handleVisibilityIconClick = (params) => {
    // setIsModalVisible(!isModalVisible);
    const history = params.row; // Get the row data from the params object
    setSelectedHistory(history); // Store the selected row data in state
    setIsModalVisible(true); // Show the modal
  };

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
  const columns = [
    { field: "taskStatus", headerName: "TaskStatus", flex: 1 },
    { field: "taskName", headerName: "Task Name", flex: 1 },
    { field: "staffName", headerName: "Staff Name", flex: 1 },
    { field: "taskDescription", headerName: "Task Description", flex: 1 },
    { field: "taskDueDate", headerName: "Due Date", flex: 1 },
    { field: "taskAccomplishDate", headerName: "Accomplish Date", flex: 1 },
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
              style={{ padding: "6px 12px" }}
              onClick={() => handleVisibilityIconClick(params)}
            >
              <VisibilityIcon />
            </Button>
          </div>
        ),
        flex: 0.5,
      },
  ];

  return (
    <Box m="20px" width="80%" margin="0 auto">
      <Header title="VIEW COMPLETED TASKS" />

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
         {isModalVisible && selectedHistory && (
        <Modal open={isModalVisible} onClose={handleVisibilityIconClick}>
       <Box sx={style}>
        <InputLabel sx={{fontSize:"20px", color:"#5cc0af", textAlign:"center"}} >Medical History</InputLabel>
              <Typography variant="subtitle1" mb={1}>
               Task Status
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.taskStatus}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />
              <Typography variant="subtitle1" mb={1}>
                Task Name
              </Typography>
              <TextField
                multiline
                value={selectedHistory.taskName}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />

              <Typography variant="subtitle1" mb={1}>
                Staff Name
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.staffName}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />


              <Typography variant="subtitle1" mb={1}>
               Task Description
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.taskDescription}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />

              {/* <Typography variant="subtitle1" mb={1}>
                 Date Assign
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.medication}
                variant="filled"
                fullWidth
                readOnly
                disabled
              /> */}

              <Typography variant="subtitle1" mb={1}>
               Due Date
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.taskDueDate}
                variant="filled"
                fullWidth
                readOnly
                disabled

              />
               <Typography variant="subtitle1" mb={1}>
              Accomplished Date
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.taskAccomplishDate}
                variant="filled"
                fullWidth
                readOnly
                disabled

              />
            </Box>
        </Modal>
      )}
        <DataGrid
          rows={tasks}
          columns={columns}
          autoPageSize
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default ViewCompletedTasks;
