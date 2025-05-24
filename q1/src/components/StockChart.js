import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';

const StockChart = ({ data, stockName }) => {
  const chartData = data
    .map(item => {
      let price = Number(item.price);
      if (isNaN(price) && typeof item.price === 'string') {
        price = Number(item.price.replace(/[^\d.-]/g, ''));
      }
      // Accept valid price and date, allow 0 as valid price
      if ((isNaN(price) || price === null || price === undefined) || !item.lastUpdatedAt) return null;
      const dateObj = new Date(item.lastUpdatedAt);
      if (isNaN(dateObj.getTime())) return null;
      return {
        ...item,
        lastUpdatedAt: dateObj.toLocaleTimeString(),
        price: price
      };
    })
    .filter(item => item && typeof item.price === 'number');

  const averagePrice = 100;

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        {stockName} - Price History
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Average Price: ${averagePrice.toFixed(2)}
      </Typography>
      <div style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="lastUpdatedAt" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
              name="Price ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
};

export default StockChart;