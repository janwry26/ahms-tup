import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import http from "../../utils/http";
import { useEffect, useState } from "react";
import "../../styles/loader.css";

const Team = () => {
  const [teamData, setTeamData] = useState({});
  const getTeam = () => {
    http.get("/user/view")
      // .then((res) => setTeamData(res.data));
      .then((res) => {
        const teamData = res.data.map((team,key)=> ({
          id: key+1,
          _id: team._id,
          firstName: team.firstName,
          lastName: team.lastName,
          username: team.username,
          email: team.email,
          contactNum: team.contactNum,
          staffId: team.staffId,
        }));
        setTeamData(teamData)
        // Process the response data and set it in the state
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTeam();
  }, []);

  //   const getMortalityReport = () => {
//     http.get('/mortality-report/view')
//         .then((res) => {
//           const reports = res.data.map((report, key) => ({
//             id: key+1,
//             _id: report._id,
//             animalID: report.animalID,
//             staffID: report.staffID,
//             casueOfDeath: report.casueOfDeath,
//             deathDate: report.deathDate,
//             deathTime: report.deathTime,
//             dateReported: report.dateReported,
//           }));
//           setReports(reports);
//         })
//         .catch((err) => console.log(err));
//   }

//   useEffect(() => {
//     getMortalityReport();
//   },[])

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
    return (
      <div className="loader-overlay1">
        <div className="loader1"></div>
      </div>
    ); // Render the loader while loading
  }
  const columns = [
    {
      field: "staffId",
      headerName: "Staff ID",
      flex: 0.4,
      cellClassName: "name-column--cell",
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "contactNum",
      headerName: "Contact Number",
      flex: 1,
    },
  ];

  return (
    <Box width="80%" margin="0 auto" className="reload-animation">
      <Header title="Details of Employee" subtitle="Viewing of Employee" />
      <Box
        m={{ xs: "20px 0 0 0", md: "40px 0 0 0" }}
        height={{ xs: "60vh", md: "75vh" }}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
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
        <DataGrid  rows={teamData} columns={columns}   components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default Team;
