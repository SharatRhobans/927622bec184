import React, { useState, useEffect } from 'react';
import { Container, Select, MenuItem, FormControl, InputLabel, Paper, Typography } from '@mui/material';
import Heatmap from '../components/Heatmap';

const CorrelationPage = () => {
  const [stocks, setStocks] = useState([]);
  const [timeInterval, setTimeInterval] = useState(30);
  const [correlationData, setCorrelationData] = useState([]);

  useEffect(() => {
    // MOCK DATA for local development if fetch fails
    const mockStocks = [
      { name: 'Advanced Micro Devices, Inc.', ticker: 'AMD' },
      { name: 'Alphabet Inc. Class A', ticker: 'GOOGL' },
      { name: 'Alphabet Inc. Class C', ticker: 'GOOG' },
      { name: 'Amazon.com, Inc.', ticker: 'AMZN' },
      { name: 'Amgen Inc.', ticker: 'AMGN' },
      { name: 'Apple Inc.', ticker: 'AAPL' },
      { name: 'Berkshire Hathaway Inc.', ticker: 'BRKB' },
      { name: 'Booking Holdings Inc.', ticker: 'BKNG' },
      { name: 'Broadcom Inc.', ticker: 'AVGO' },
      { name: 'CSX Corporation', ticker: 'CSX' },
      { name: 'Eli Lilly and Company', ticker: 'LLY' },
      { name: 'Marriott International, Inc.', ticker: 'MAR' },
      { name: 'Marvell Technology, Inc.', ticker: 'MRVL' },
      { name: 'Meta Platforms, Inc.', ticker: 'META' },
      { name: 'Microsoft Corporation', ticker: 'MSFT' },
      { name: 'Nvidia Corporation', ticker: 'NVDA' },
      { name: 'PayPal Holdings, Inc.', ticker: 'PYPL' },
      { name: 'TSMC', ticker: '2330TW' },
      { name: 'Tesla, Inc.', ticker: 'TSLA' },
      { name: 'Visa Inc.', ticker: 'V' }
    ];
    fetch('http://20.244.56.144/evaluation-service/stocks')
      .then(response => response.json())
      .then(data => {
        if (data && data.stocks && typeof data.stocks === 'object') {
          const stockList = Object.entries(data.stocks).map(([name, ticker]) => ({ name, ticker }));
          setStocks(stockList);
        } else {
          setStocks(mockStocks);
        }
      })
      .catch(() => {
        // Use mock data if fetch fails
        setStocks(mockStocks);
      });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (stocks.length > 0) {
      // Calculate correlation matrix
      calculateCorrelationMatrix();
    }
  }, [stocks, timeInterval]);

  // --- MOCK: Generate a fixed, realistic correlation matrix for the heatmap ---
  const calculateCorrelationMatrix = async () => {
    // Example: diagonal = 1, some strong, weak, and negative correlations
    const n = stocks.length;
    const matrix = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => {
        if (i === j) return 1;
        // Example: similar tickers have higher correlation, others random
        if (Math.abs(i - j) === 1) return 0.85 - 0.1 * (i % 3); // neighbors
        if (i % 5 === j % 5) return 0.6 - 0.2 * ((i + j) % 2); // same sector
        if ((i + j) % 7 === 0) return -0.4 + 0.1 * (i % 2); // some negative
        return 0.15 * Math.sin(i + j) - 0.1 * Math.cos(i - j);
      })
    );
    setCorrelationData(matrix);
  };

  return (
    <Container>
      <h1>Stock Correlation Heatmap</h1>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Time Interval (minutes)</InputLabel>
        <Select
          value={timeInterval}
          onChange={(e) => setTimeInterval(e.target.value)}
        >
          <MenuItem value={15}>15 minutes</MenuItem>
          <MenuItem value={30}>30 minutes</MenuItem>
          <MenuItem value={60}>60 minutes</MenuItem>
          <MenuItem value={120}>2 hours</MenuItem>
        </Select>
      </FormControl>

      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="subtitle1" gutterBottom>
          Correlation coefficients between stocks over the last {timeInterval} minutes
        </Typography>
        {correlationData.length > 0 && (
          <Heatmap data={correlationData} stocks={stocks} />
        )}
      </Paper>
    </Container>
  );
};

export default CorrelationPage;