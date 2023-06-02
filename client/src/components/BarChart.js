import { useEffect, useState } from 'react';
import http from '../utils/http';
import { ResponsivePie } from '@nivo/pie';
import { useTheme } from '@mui/material';
import { tokens } from "../theme";
import '../styles/charts.css';

const PieChart = () => {
  const [reports, setReports] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getHealthReports = () => {
    http.get('/health-report/view')
      .then((res) => {
        const reportPromises = res.data.map((report, key) => {
          return http.get(`/animal/view/${report.animalID}`)
            .then((animalRes) => {
              const animalName = animalRes.data.animalName;
              return {
                id: key + 1,
                _id: report._id,
                animalID: report.animalID,
                staffID: report.staffID,
                animalName: animalName,
                healthDescription: report.healthDescription,
                nextCheckupDate: report.nextCheckupDate,
                medication: report.medication,
                vaccineStatus: report.vaccineStatus,
              };
            });
        });
        Promise.all(reportPromises).then((completedReports) => {
          setReports(completedReports);
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getHealthReports();
  }, []);

  const vaccinatedAnimals = reports.filter((report) => report.vaccineStatus === 'Vaccinated');
  const notVaccinatedAnimals = reports.filter((report) => report.vaccineStatus === 'Not Vaccinated');

  const chartData = [
    {
      id: 'Vaccinated',
      label: 'Vaccinated',
      value: vaccinatedAnimals.length,
    },
    {
      id: 'Not Vaccinated',
      label: 'Not Vaccinated',
      value: notVaccinatedAnimals.length,
    },
  ];

  // Define a new colors array with green and red
  const visibleColors = ['#5cc0af', '#b42f2f'];

  return (
    <ResponsivePie
      data={chartData}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={true}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#5cc0af",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.986)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#fff",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#999",
              },
            },
          ],
        },
      ]}
      colors={visibleColors} // Use the new colors array
     
      tooltip={({ datum }) => (
        <div className="chart-tooltip">
          <div className="tooltip-header">Vaccine Information</div>
          <div className="tooltip-content">
            <div>{datum.label + ': ' + datum.value}</div>
          </div>
        </div>
      )}
      
    />
  );
};

export default PieChart;
