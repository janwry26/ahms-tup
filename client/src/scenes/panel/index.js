import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useState,useEffect } from "react";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import LineChart from "../../components/LineChart";
import InventoryIcon from '@mui/icons-material/Inventory';
import { Link } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import PreviewIcon from '@mui/icons-material/Preview';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import "./style.css";
import "../../styles/loader.css"

const Dashboard = () => {
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
    return <div>
    <div className="loader1"></div>
  </div> // Render the loader while loading
  }
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
         <Box
           className="row1"
          gridColumn="span 3"
          backgroundColor={colors.blueAccent[700]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="20px"
        
        >
          <Link
            to="inventory1"
            style={{
              textDecoration: 'none', // Remove underline
              display: 'flex', // Preserve the flex layout
              alignItems: 'center', // Center the content vertically
              justifyContent: 'center', // Center the content horizontally
              width: '100%', // Ensure the link takes full width within the parent
            }}
          >
            <StatBox  
              title="Inventory"
              subtitle="Access Here"
              increase="+34%"

              icon={
                <InventoryIcon
                  sx={{ color: colors.greenAccent[500], fontSize: "26px" }}
                />
              }
            />
          </Link>
        </Box>

   

        <Box
         className="row1"
          gridColumn="span 3"
          backgroundColor={colors.greenAccent[100]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="20px"

        >
           <Link
            to="animal"
            style={{
              textDecoration: 'none', // Remove underline
              display: 'flex', // Preserve the flex layout
              alignItems: 'center', // Center the content vertically
              justifyContent: 'center', // Center the content horizontally
              width: '100%', // Ensure the link takes full width within the parent
            }}
          >
          <StatBox
            title="Animal Records"
            subtitle="Access Here"
            progress="0.50"
            increase="+21%"
            icon={
              <PetsIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
          </Link>
        </Box>
        <Box
        className="row1"
          gridColumn="span 3"
          backgroundColor={colors.redAccent[100]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="20px"

        >
           <Link
            to="observation"
            style={{
              textDecoration: 'none', // Remove underline
              display: 'flex', // Preserve the flex layout
              alignItems: 'center', // Center the content vertically
              justifyContent: 'center', // Center the content horizontally
              width: '100%', // Ensure the link takes full width within the parent
            }}
          >
          <StatBox
            title="Observation Report"
            subtitle="Access Here"
            progress="0.30"
            increase="+5%"
            icon={
              <PreviewIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
          </Link>
        </Box>
        <Box
        className="row1"
          gridColumn="span 3"
          backgroundColor={colors.redAccent[200]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="20px"
        >
          <Link
            to="medical"
            style={{
              textDecoration: 'none', // Remove underline
              display: 'flex', // Preserve the flex layout
              alignItems: 'center', // Center the content vertically
              justifyContent: 'center', // Center the content horizontally
              width: '100%', // Ensure the link takes full width within the parent
            }}
          >
          <StatBox
            title="Medical History"
            subtitle="Access Here"
            progress="0.80"
            increase="+43%"
            icon={
              <MedicalInformationIcon 
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
          </Link> 
        </Box>

        {/* ROW 2 */}
        <Box
         className="row1"
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
           <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Line Chart For Mortality Information
          </Typography>
          <Box height="250px" mt="-20px">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
         className="row1"
          gridColumn="span 4"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Pie Chart For Vaccine Status
          </Typography>
          <Box height="500px" mt="40px">
            <PieChart isDashboard={true} />
          </Box>
        </Box>
      
        

        {/* ROW 3 */}
        <Box
         className="row1"
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
           <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Bar Chart For Inventory Information
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
         
        </Box>
       
    
      </Box>
    </Box>
  
   
  );
};

export default Dashboard;