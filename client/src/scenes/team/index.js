import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import http from "../../utils/http";
import { useEffect, useState } from "react";
import "../../styles/loader.css";
import { FaArchive, } from "react-icons/fa";
import {  Button } from "react-bootstrap";

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

  const handleDeleteReport = (_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        http
          .put(`/user/archive/${_id}`)
          .then((res) => {
            console.log(res);
            Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
            getTeam(); // Refresh the products list
          })
          .catch((err) => console.log(err));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your product is safe :)', 'error');
      }
    });
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
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
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
        </div>
      ),
      flex: 0.4,
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
