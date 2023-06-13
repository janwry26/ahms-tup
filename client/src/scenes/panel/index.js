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
import http from "../../utils/http";
import { formatDate } from "../../utils/formatDate";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true); 
  const [totalItems, setTotalItems] = useState(0);
  const [totalAnimal, setTotalAnimal] = useState(0);
  const [totalObserved, setTotalObserved] = useState(0);
  const [totalMedical, setTotalMedical] = useState(0);

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const getProducts = () => {
      http.get('/inventory/view')
        .then((res) => {
          const products = res.data.map((product, key) => ({
            id: key + 1,
            _id: product._id,
            expDate: product.expDate,
            itemDescription: product.itemDescription,
            itemName: product.itemName,
            itemType: product.itemType,
            quantity: product.quantity,
          }));
          setTotalItems(products.reduce((total, product) => total + product.quantity, 0));
          
        })
        .catch((err) => console.log(err));
    }
    const getAnimalRecord = () => {
      http.get('/animal/view')
        .then((res) => {
          const records = res.data.map((record, key) => ({
            id: key + 1,
            _id: record._id,
            animalID: record.animalID,
            animalName: record.animalName,
            species: record.species,
            age: record.age,
            gender: record.gender,
            breedType: record.breedType,
            weight: record.weight,
            birthDate: formatDate(record.birthDate),
          }));

          const uniqueSpecies = [...new Set(records.map(record => record.species))]; 
          const totalSpecies = uniqueSpecies.length;
          setTotalAnimal(totalSpecies); 
        })
        .catch((err) => console.log(err));
    };
    const getObservationReport = () => {
      http.get('/observation-report/view')
        .then((res) => {
          const reports = res.data.map((report, key) => ({
            id: key + 1,
            _id: report._id,
            animalID: report.animalID,
            staffID: report.staffID,
            reportDescription: report.reportDescription,
            dateReported: report.dateReported,
          }));
  
          const uniqueSpecies = [...new Set(reports.map(report => report.animalID))]; 
          const totalObserve = uniqueSpecies.length;
          setTotalObserved(totalObserve); 
        })
        .catch((err) => console.log(err));
    }
      const getHealthReport = () => {
        http.get('/health-report/view')
            .then((res) => {
              const reports = res.data.map((report, key) => ({
                id: key+1,
                _id: report._id,
                animalID: report.animalID,
                staffID: report.staffID,
                healthDescription: report.healthDescription,
                nextCheckupDate: report.nextCheckupDate,
                medication: report.medication,
                vaccineStatus: report.vaccineStatus,
              }));
              const uniqueSpecies = [...new Set(reports.map(report => report.healthDescription))]; 
              const medical = uniqueSpecies.length;
              setTotalMedical(medical); 
            })
            .catch((err) => console.log(err));
      }
          getHealthReport();
          getAnimalRecord();
          getObservationReport();
          getProducts();
          
          const randomProgress = Math.random().toFixed(2); // Generate random number between 0 and 0.99 with 2 decimal places
          setProgress(randomProgress);
          // Simulate loading delay
          const timer = setTimeout(() => {
            setIsLoading(false);
          }, 1000);

          return () => clearTimeout(timer); // Clean up the timer on unmount
        }, []);

        if (isLoading) {
          return (
            <div>
              <div className="loader1"></div>
            </div>
          ); // Render the loader while loading
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
              progress={`${progress}`}
              increase={<span style={{ fontWeight: "bold",color: "#ffffff" }}>{`${totalItems.toString()} total of items`}</span>}
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
            progress={`${progress}`}
            increase={<span style={{fontWeight: "bold", color: "#ffffff" }}>{`${totalAnimal.toString()} total of animals`}</span>}
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
            progress={`${progress}`}
            // increase={`${totalObserved.toString()} animal reports`} // Show total number of items
            increase={<span style={{ fontWeight: "bold",color: "#ffffff" }}>{`${totalObserved.toString()} animal reports`}</span>}

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
            progress={`${progress}`}
            // increase={`${totalMedical.toString()} medical reports`} // Show total number of items
            increase={<span style={{ fontWeight: "bold",color: "#ffffff" }}>{`${totalMedical.toString()} medical reports`}</span>}

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
          gridColumn="span 7"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
           <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
          Inventory Information
          </Typography>
          <Box height="250px" mt="-20px">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
         className="row1"
          gridColumn="span 5"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
           Vaccine Status
          </Typography>
          <Box height="500px" mt="40px">
            <PieChart isDashboard={true} />
          </Box>
        </Box>
      
        

        {/* ROW 3 */}
        <Box
         className="row1"
          gridColumn="span 7"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
           <Typography
            variant="h5"
            fontWeight="600"
          >
           Mortality Information
          </Typography>
          <Box height="250px" mt="-30px">
            <BarChart isDashboard={true} />
          </Box>
         
        </Box>
       
    
      </Box>
    </Box>
  
   
  );
};

export default Dashboard;