import { useState, useEffect } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import { FaSearch } from "react-icons/fa";
import Autocomplete from "@mui/material/Autocomplete";
import http from "../../utils/http";
import Header from "../../components/Header";
import { formatDate } from "../../utils/formatDate";

const ViewMedicalHistory = () => {
  const [searchAnimalName, setSearchAnimalName] = useState("");
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [reports, setReports] = useState([]);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);
  const [animalNames, setAnimalNames] = useState([]);

  const handleSearch = (event) => {
    event.preventDefault();
    const animalName = event.target.animalName.value;
    setSearchAnimalName(animalName);
    getMedicalHistory(animalName);
    event.target.reset();
  };

  const getMedicalHistory = (animalName) => {
    const filteredReports = reports.filter((report) =>
      report.animalName.toLowerCase().includes(animalName.toLowerCase())
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
            const animalRequest = http.get(`/animal/view/${report.animalID}`);
            const staffRequest = http.get(`/user/view/${report.staffID}`);

            return Promise.all([animalRequest, staffRequest]).then(
              ([animalRes, staffRes]) => {
                const animalName = animalRes.data.animalName;
                const staffName = `${staffRes.data.lastName}, ${staffRes.data.firstName}`;

                return {
                  id: key + 1,
                  _id: report._id,
                  animalID: report.animalID,
                  staffID: report.staffID,
                  animalName: animalName,
                  staffName: staffName,
                  healthDescription: report.healthDescription,
                  nextCheckupDate: formatDate(report.nextCheckupDate),
                  medication: report.medication,
                  vaccineStatus: report.vaccineStatus,
                };
              }
            );
          });

          Promise.all(reportPromises)
            .then((reports) => {
              setReports(reports);
              setAnimalNames(reports.map((report) => report.animalName));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    };

    getHealthReport();
  }, []);

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
                  name="animalName"
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
          <Button type="submit" variant="contained" size="large" color="secondary" className="ms-2" startIcon={<FaSearch />}  sx={{width: 180, height: 50,}}>
            Search
          </Button>
        </Box>
      </form>

      {showMedicalHistory && (
        <form>
          {medicalHistory.map((history, index) => (
            <Box key={index} mb={3}>
              <Typography variant="subtitle1" mb={1}>
                Animal Name
              </Typography>
              <TextField
                type="text"
                value={history.animalName}
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
                value={history.staffName}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />

              <Typography variant="subtitle1" mb={1}>
                Health Description
              </Typography>
              <TextField
                multiline
                value={history.healthDescription}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />

              <Typography variant="subtitle1" mb={1}>
                Next Checkup Date
              </Typography>
              <TextField
                type="text"
                value={history.nextCheckupDate}
                variant="filled"
                fullWidth
                readOnly
                disabled
              />

              <Typography variant="subtitle1" mb={1}>
                Medication
              </Typography>
              <TextField
                type="text"
                value={history.medication}
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
                value={history.vaccineStatus}
                variant="filled"
                fullWidth
                readOnly
                disabled
                
              />
            </Box>
          ))}
        </form>
      )}
    </Box>
  );
};

export default ViewMedicalHistory;
