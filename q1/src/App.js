import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import StockPage from './pages/StockPage';
import CorrelationPage from './pages/CorrelationPage';

function App() {
  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Stock Analytics
            </Typography>
            <Tabs value={false}>
              <Tab label="Stock View" component={Link} to="/" />
              <Tab label="Correlation Heatmap" component={Link} to="/correlation" />
            </Tabs>
          </Toolbar>
        </AppBar>
        
        <Routes>
          <Route path="/" element={<StockPage />} />
          <Route path="/correlation" element={<CorrelationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;