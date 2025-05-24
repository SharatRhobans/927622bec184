import React, { useState, useEffect } from 'react';
import { Container, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useLocation } from 'react-router-dom';
import StockChart from '../components/StockChart';

const StockPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stockFromQuery = queryParams.get('stock');

  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [timeInterval, setTimeInterval] = useState(30);
  const [priceData, setPriceData] = useState([]);

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
          if (stockList.length > 0) {
            setSelectedStock(stockFromQuery || stockList[0].ticker);
          }
        } else {
          setStocks(mockStocks);
          setSelectedStock(stockFromQuery || mockStocks[0].ticker);
        }
      })
      .catch(() => {
        setStocks(mockStocks);
        setSelectedStock(stockFromQuery || mockStocks[0].ticker);
      });
  }, [stockFromQuery]);

  useEffect(() => {
    if (selectedStock) {
      // Fetch real price data from API, fallback to realistic mock data
      fetch(`http://20.244.56.144/evaluation-service/stocks/${selectedStock}?minutes=${timeInterval}`)
        .then(response => response.json())
        .then(data => {
          // API may return an array or a single object
          if (Array.isArray(data)) {
            setPriceData(data);
          } else if (data && data.price && data.lastUpdatedAt) {
            setPriceData([data]);
          } else if (data && data.stock && data.stock.price && data.stock.lastUpdatedAt) {
            setPriceData([{ price: data.stock.price, lastUpdatedAt: data.stock.lastUpdatedAt }]);
          } else {
            // fallback to mock
            generateMock();
          }
        })
        .catch(() => {
          generateMock();
        });
      function generateMock() {
        const now = Date.now();
        const mockPrices = Array.from({length: 30}, (_, i) => ({
          price: Number((Math.random() * 900 + 100).toFixed(5)),
          lastUpdatedAt: new Date(now - (30 - i) * 60000).toISOString()
        }));
        setPriceData(mockPrices);
      }
    }
  }, [selectedStock, timeInterval]);

  return (
    <Container>
      <h1>Stock Price Analysis</h1>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Stock</InputLabel>
        <Select
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
        >
          {stocks.map((stock) => (
            <MenuItem key={stock.ticker} value={stock.ticker}>
              {stock.name} ({stock.ticker})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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

      {priceData.length > 0 ? (
        <StockChart data={priceData} stockName={stocks.find(s => s.ticker === selectedStock)?.name} />
      ) : (
        <div style={{color: 'red', marginTop: '20px'}}>No price data available for the selected stock and interval.</div>
      )}
    </Container>
  );
};

export default StockPage;