import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import InventoryIcon from '@mui/icons-material/Inventory';
import { Link } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import PreviewIcon from '@mui/icons-material/Preview';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import "./style.css";
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
         className="row1"
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
         className="row1"
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
         className="row1"
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
         className="row1"
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  
   
  );
};

export default Dashboard;