import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Modal,InputLabel } from "@mui/material";
import { FaSearch } from "react-icons/fa";
import Autocomplete from "@mui/material/Autocomplete";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import http from "../../utils/http";
import Header from "../../components/Header";
import { formatDate } from "../../utils/formatDate";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ViewMedicalHistory = () => {
  const [searchAnimalName, setSearchAnimalName] = useState("");
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [reports, setReports] = useState([]);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);
  const [animalNames, setAnimalNames] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // New state for modal visibility
  const [selectedHistory, setSelectedHistory] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  
  };
  

  const getUniqueAnimalNames = (reports) => {
    const animalNamesSet = new Set(
      reports.map((report) => report.nickname.toLowerCase())
    );
    return Array.from(animalNamesSet);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const nickname = event.target.nickname.value;
    setSearchAnimalName(nickname);
    getMedicalHistory(nickname);
    event.target.reset();
  };

  const getMedicalHistory = (nickname) => {
    const filteredReports = reports.filter((report) =>
      report.nickname.toLowerCase().includes(nickname.toLowerCase())
    );
    setMedicalHistory(filteredReports);
    setShowMedicalHistory(true);
  };

  useEffect(() => {
    const getHealthReport = () => {
      http
        .get("/health-report/view")
        .then((res) => {
          const reportPromises = res.data.map((report, key) => {
            const animalRequest = http.get(`/health-report/view/${report.animalID}`);
            const staffRequest = http.get(`/user/view/${report.staffID}`);

            return Promise.all([animalRequest, staffRequest]).then(
              ([animalRes, staffRes]) => {
                const nickname = animalRes.data.nickname;
                const staffName = `${staffRes.data.lastName}, ${staffRes.data.firstName}`;

                return {
                  // id: key + 1,
                  // _id: report._id,
                  // animalID: report.animalID,
                  // enclosure:report.enclosure,
                  // dateObserved: report.dateObserved,
                  // age: report.age,
                  // staffID: report.staffID,
                  // nickname: nickname,
                  // staffName: staffName,
                  id: key + 1,
                  _id: report._id,
                  animalID: report.animalID,
                  staffID: report.staffID,
                  staffName: staffName,
                  enclosure : report.enclosure,
                  nickname: report.nickname,
                  age: report.age,
                  dateObserved: formatDate(report.dateObserved),
                  healthDescription: report.healthDescription,
                  nextCheckupDate: report.nextCheckupDate,
                  medication: report.medication,
                  vaccineStatus: report.vaccineStatus,
                  veterinarian: report.veterinarian,
                  animalHealth: report.animalHealth,
                 
                };
              }
            );
          });

          Promise.all(reportPromises)
            .then((reports) => {
              setReports(reports);
              setAnimalNames(getUniqueAnimalNames(reports));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    };

    getHealthReport();
  }, []);

  const handleVisibilityIconClick = (params) => {
    // setIsModalVisible(!isModalVisible);
    const history = params.row; // Get the row data from the params object
    setSelectedHistory(history); // Store the selected row data in state
    setIsModalVisible(true); // Show the modal
  };

  const columns = [
    { field: "nickname", headerName: "Animal Name", flex: 1 },
    { field: "enclosure", headerName: "Enclosure", flex: 1 },
    { field: "dateObserved", headerName: "Date of Observation", flex: 1 },
    { field: "age", headerName: "Age", flex: 0.8 },
    { field: "healthDescription", headerName: "Case", flex: 1 },
    { field: "medication", headerName: "Treatment", flex: 1 },
    { field: "animalHealth", headerName: "Animal Health", flex: 1 },
    { field: "nextCheckupDate", headerName: "Remarks", flex: 1 },
    { field: "staffName", headerName: "Reported By", flex: 1 },
    { field: "veterinarian", headerName: "Veterinarian", flex: 1 },
    { field: "vaccineStatus", headerName: "Vaccination Status", flex: 1 },
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
      <Header
        title="VIEW MEDICAL HISTORY"
        subtitle="View animal medical history by name"
        fontSize="36px"
        mt="20px"
      />
      <form onSubmit={handleSearch}>
        <Box display="flex" alignItems="center" marginBottom="20px">
          <Box width="100%">
            <Autocomplete
              options={animalNames}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="nickname"
                  label="Animal Name"
                  placeholder="Enter animal name"
                  variant="filled"
                  fullWidth
                  required
                  autoFocus
                />
              )}
              value={searchAnimalName}
              onChange={(event, value) => setSearchAnimalName(value)}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            size="large"
            color="secondary"
            className="ms-2"
            startIcon={<FaSearch />}
            sx={{ width: 180, height: 50 }}
          >
            Search
          </Button>
        </Box>
      </form>

      {showMedicalHistory && (
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
            rows={medicalHistory}
            columns={columns}
            autoPageSize
            disableSelectionOnClick
           components={{ Toolbar: GridToolbar }}

          />
        </Box>
      )}

      {isModalVisible && selectedHistory && (
        <Modal open={isModalVisible} onClose={handleVisibilityIconClick}>
       <Box sx={style}>
        <InputLabel sx={{fontSize:"20px", color:"#5cc0af", textAlign:"center"}} >Medical History</InputLabel>
              <Typography variant="subtitle1" mb={1}>
                Animal Name
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.nickname}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />


            <Typography variant="subtitle1" mb={1}>
               Enclosure
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.enclosure}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />
              <Typography variant="subtitle1" mb={1}>
               Date of observation
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.dateObserved}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />
              <Typography variant="subtitle1" mb={1}>
                age
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.age}
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
               case
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.healthDescription}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />
              
              <Typography variant="subtitle1" mb={1}>
                Treatment
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.medication}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />
                <Typography variant="subtitle1" mb={1}>
               Animal Health
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.animalHealth}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />

              <Typography variant="subtitle1" mb={1}>
               Veterinarian
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.veterinarian}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />


              <Typography variant="subtitle1" mb={1}>
               Remarks
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.nextCheckupDate}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />


              <Typography variant="subtitle1" mb={1}>
                Vaccination Status
              </Typography>
              <TextField
                type="text"
                value={selectedHistory.vaccineStatus}
                variant="filled"
                fullWidth
                readOnly
                disabled

              />
            </Box>
        </Modal>
      )}
    </Box>
  );
};

export default ViewMedicalHistory;
