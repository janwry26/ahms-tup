import { useEffect, useState, useRef } from 'react';
import http from '../utils/http';
import Chart from 'chart.js/auto';
import moment from 'moment';
import '../styles/charts.css';

const LineChart = () => {
  const [products, setProducts] = useState([]);
  const chartRef = useRef(null);

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
        setProducts(products);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (chartRef.current !== null) {
      chartRef.current.destroy();
    }

    const chartElement = document.getElementById('lineChart');
    const chartData = {
      labels: products.map((product) => product.itemName),
      datasets: [
        {
          label: 'Quantity',
          data: products.map((product) => product.quantity),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          lineTension: 0,
        },
      ],
    };

    const maxQuantityProduct = products.reduce((prevProduct, currentProduct) => {
      return prevProduct.quantity > currentProduct.quantity ? prevProduct : currentProduct;
    }, {});

    const today = moment();
    const soonToExpireProduct = products.find((product) => {
      const expirationDate = moment(product.expDate);
      return expirationDate.diff(today, 'days') <= 30;
    });

    chartRef.current = new Chart(chartElement, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: '#5cc0af',
              borderColor: '#5cc0af',
              lineWidth: 2,
            },
            ticks: {
              stepSize: 10,
              font: {
                size: 18,
                color: '#ffffff',
              },
            },
          },
          x: {
            grid: {
              display: true,
              color: '#5cc0af',
              borderColor: '#5cc0af',
              lineWidth: 2,
            },
            ticks: {
              font: {
                size: 18,
                color: '#ffffff',
              },
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 18,
                color: '#ffffff',
              },
              generateLabels: function (chart) {
                const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                const maxQuantityLabel = {
                  text: `Most Quantity: ${maxQuantityProduct.itemName}`,
                  fillStyle: 'rgba(75, 192, 192, 1)',
                  font: {
                    size: 22,
                    color: '#ffffff',
                  },
                };
                labels.push(maxQuantityLabel);
                if (soonToExpireProduct) {
                  const expirationDate = moment(soonToExpireProduct.expDate);
                  const expirationLabel = {
                    text: `Soon to Expire: ${soonToExpireProduct.itemName} (${expirationDate.format('MM/DD/YYYY')})`,
                    fillStyle: 'red',
                    font: {
                      size: 16,
                      color: '#ffffff',
                    },
                  };
                  labels.push(expirationLabel);
                }
                return labels;
              },
            },
          },
        },
      },
    });
  }, [products]);

  return <canvas id="lineChart" width="400" height="200"></canvas>;
};

export default LineChart;
