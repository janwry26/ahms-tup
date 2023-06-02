import { useEffect, useState } from 'react';
import http from '../utils/http';
import { ResponsivePie } from '@nivo/pie';
import { useTheme } from '@mui/material';
import { tokens } from "../theme";

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

  // Define a new colors array with more visible colors
  const visibleColors = ['#00b894', '#e74c3c'];

  return (
    <ResponsivePie
      data={chartData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
            fontSize: 14,
          },
        },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      colors={visibleColors}
      borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
      enableRadialLabels={false}
      radialLabel={(d) => `${d.label} (${d.value})`}
      radialLabelsSkipAngle={10}
      radialLabelsTextColor={colors.greenAccent[400]}
      radialLabelsLinkColor={{ from: 'color' }}
      sliceLabel={(d) => `${d.value}`}
      sliceLabelsSkipAngle={10}
      sliceLabelsTextColor={colors.text}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: 'pink',
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#97E3D5',
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;
