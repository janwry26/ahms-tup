import { Box,Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import "../../styles/loader.css";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import http from "../../utils/http";


const Contacts = () => {
  const [teamData, setTeamData] = useState([]);
  const getTeam = () => {
    http.get("/admin/view")
      .then((res) => {
        const teamData = res.data.map((team, key) => ({
          id: key + 1,
          _id: team._id,
          email: team.email,
          accType: team.accType,
        }));
        setTeamData(teamData);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTeam();
  }, []);


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
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "accType",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { accType } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              accType === "admin"
                ? colors.greenAccent[600]
                : accType === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {accType === "Super Admin" && <AdminPanelSettingsOutlinedIcon />}
            {accType === "Admin" && <SecurityOutlinedIcon />}
            <Typography
              color={colors.grey[100]}
              sx={{
                ml: { xs: "0", md: "5px" },
                display: { xs: "none", md: "block" },
              }}
            >
              {accType}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px" width="80%" margin="0 auto" className="reload-animation">
      <Header
        title="Details of Admin"
        subtitle="Viewing of Admin"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
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
        <DataGrid
          rows={teamData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
