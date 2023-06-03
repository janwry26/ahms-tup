import { useEffect, useState } from 'react';
import http from '../utils/http';
import { ResponsiveBar } from '@nivo/bar';
import { useTheme } from '@mui/material';
import { tokens } from "../theme";
import '../styles/charts.css';

const BarChart = () => {
  const [reports, setReports] = useState([]);


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

    const getMortalityReport = () => {
    http.get('/mortality-report/view')
        .then((res) => {
          const reports = res.data.map((report, key) => ({
            id: key+1,
            _id: report._id,
            animalID: report.animalID,
            staffID: report.staffID,
            casueOfDeath: report.casueOfDeath,
            deathDate: report.deathDate,
            deathTime: report.deathTime,
            dateReported: report.dateReported,
          }));
          setReports(reports);
        })
        .catch((err) => console.log(err));
  }

  useEffect(() => {
    getMortalityReport();
  },[])

  
  const Tooltip = ({ data }) => (
    <div className="chart-tooltip">
         <div className="tooltip-header">Death Information</div>
      <div className='tooltip-content'>{`Count of Deaths: ${data.count}`}</div>
    </div>

    
  );
  const causeOfDeathCounts = reports.reduce((counts, report) => {
    counts[report.casueOfDeath] = (counts[report.casueOfDeath] || 0) + 1;
    return counts;
  }, {});

  const sortedCausesOfDeath = Object.keys(causeOfDeathCounts).sort(
    (a, b) => causeOfDeathCounts[b] - causeOfDeathCounts[a]
  );

  const mostCommonCauseOfDeath =
    sortedCausesOfDeath.length > 0 ? sortedCausesOfDeath[0] : '';

  const chartData = Object.keys(causeOfDeathCounts).map((causeOfDeath) => ({
    causeOfDeath,
    count: causeOfDeathCounts[causeOfDeath],
  }));

  const highestDeathCount = Math.max(...Object.values(causeOfDeathCounts));

  const getTickValues = (count) => {
    const tickValues = [];
    for (let i = 0; i <= count; i++) {
      tickValues.push(i);
    }
    return tickValues;
  };

  return (
    <ResponsiveBar
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
      keys={['count']}
      indexBy="causeOfDeath"
      margin={{ top: 50, right: 350, bottom: 50, left: 60 }}
      padding={0.5}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={['#5cc0af']}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Cause of Death',
        legendPosition: 'middle',
        legendOffset: 40,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Number of Deaths',
        legendPosition: 'middle',
        legendOffset: -40,
        tickValues: getTickValues(highestDeathCount),
        valueScale:'linear',
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="white"
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      legends={[
        {
          data: [
            {
              id: 'mostCommonCauseOfDeath',
              label: `Most Common Cause of Death: ${mostCommonCauseOfDeath}`,
              color: 'red',
            },
          ],
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 310,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 300,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemTextColor: 'white',
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: 'red',
              },
            },
          ],
        },
      ]}
      tooltip={Tooltip}
    />
  );
};

export default BarChart;
