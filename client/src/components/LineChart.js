import { useEffect, useState } from 'react';
import http from '../utils/http';
import { ResponsiveBar } from '@nivo/bar';
import moment from 'moment';
import { useTheme } from '@mui/material';
import { tokens } from "../theme";
import '../styles/charts.css';

const BarChart = () => {
  const [products, setProducts] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getProducts = () => {
    http
      .get('/inventory/view')
      .then((res) => {
        const products = res.data.map((product, key) => ({
          id: key + 1,
          _id: product._id,
          expDate: product.expDate,
          itemDescription: product.itemDescription,
          itemName: product.itemName,
          itemType: product.itemType,
          quantity: product.quantity,
          expired: moment(product.expDate).isBefore(moment()),
        }));
        setProducts(products);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getProducts();
  }, []);

  const maxQuantityProduct = products.reduce((prevProduct, currentProduct) => {
    return prevProduct.quantity > currentProduct.quantity ? prevProduct : currentProduct;
  }, {});

  const today = moment();
  const nonExpiredProducts = products.filter((product) => !product.expired);
  const soonToExpireProduct = nonExpiredProducts.length > 0
    ? nonExpiredProducts.reduce((prevProduct, currentProduct) => {
        const prevExpirationDate = moment(prevProduct.expDate);
        const currentExpirationDate = moment(currentProduct.expDate);
        const prevDiff = prevExpirationDate.diff(today, 'days');
        const currentDiff = currentExpirationDate.diff(today, 'days');
        return prevDiff < currentDiff ? prevProduct : currentProduct;
      })
    : null;

  const expiredProducts = products.filter((product) => product.expired);

  const chartData = products.map((product) => ({
    itemName: product?.itemName || '',
    quantity: product?.quantity || 0,
    expDate: product?.expDate || '',
    expired: product?.expired || false,
  }));

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
      keys={['quantity']}
      indexBy="itemName"
      margin={{ top: 50, right: 350, bottom: 50, left: 60 }}
      padding={0.2}
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
        legend: 'Item',
        legendPosition: 'middle',
        legendOffset: 40,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Quantity',
        legendPosition: 'middle',
        legendOffset: -40,
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
              id: 'maxQuantityProduct',
              label: `Most Quantity: ${maxQuantityProduct?.itemName || ''}`,
              color: 'rgba(75, 192, 192, 1)',
            },
            {
              id: 'soonToExpireProduct',
              label: soonToExpireProduct
                ? `Soon to Expire: ${soonToExpireProduct.itemName} (Exp Date: ${moment(
                    soonToExpireProduct.expDate
                  ).format('MM/DD/YYYY')})`
                : '',
              color: 'red',
            },
            {
              id: 'expiredProduct',
              label: expiredProducts.length > 0
                ? `Expired: ${expiredProducts.map((product) => product.itemName).join(', ')}`
                : '',
              color: 'red',
              fill: 'red',
              style: {
                textDecoration: 'line-through',
              },
            },
          ],
          anchor: "bottom-right",
          direction: 'column',
          justify: false,
          translateX: 310,
          translateY: 0,
          itemsSpacing: 10,
          itemWidth: 300,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 20,
          symbolShape: 'square',

      
          effects: [
            {
              on: 'hover',
              style: {
                color: 'black',
              },
            },
          ],
        },
      ]}
      tooltip={({ id, value, data }) => (
        <div className="chart-tooltip">
          <div className="tooltip-header">PRODUCT INFORMATION</div>
          <div className="tooltip-content">
            <div>Quantity: {value}</div>
            <div>Expiration Date: {moment(data.expDate).format('MM/DD/YYYY')}</div>
            {data.expired && <div className="expired-label">Expired</div>}
          </div>
        </div>
      )}
    />
  );
};

export default BarChart;
