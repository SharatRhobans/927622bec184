import React from 'react';
import HeatMap from 'react-heatmap-grid';
import { Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CustomHeatmap = ({ data, stocks }) => {
  const navigate = useNavigate();

  // Prepare x and y labels
  const xLabels = stocks.map(stock => stock.ticker);
  const yLabels = stocks.map(stock => stock.ticker);

  // Prepare data for heatmap-grid (2D array)
  let heatmapData;
  if (Array.isArray(data) && data.length && Array.isArray(data[0])) {
    // Already a 2D array
    heatmapData = data;
  } else if (Array.isArray(data) && data.length && typeof data[0] === 'object' && 'x' in data[0] && 'y' in data[0] && 'value' in data[0]) {
    // Convert array of {x, y, value} objects to 2D array
    heatmapData = yLabels.map(y => xLabels.map(x => {
      const found = data.find(d => d.x === x && d.y === y);
      return found ? Number(found.value) : 0;
    }));
  } else {
    // Generate random data (as numbers, not strings)
    heatmapData = yLabels.map((_, i) => xLabels.map((_, j) => (i === j ? 1 : Number((Math.random() * 2 - 1).toFixed(2)))));
  }

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Stock Correlation Heatmap
      </Typography>
      <Typography variant="subtitle1" gutterBottom style={{ marginBottom: '10px' }}>
        Average Price: 100
      </Typography>
      <div style={{ height: '500px', width: '100%' }}>
        {xLabels.length === 0 || yLabels.length === 0 || !heatmapData.length ? (
          <Typography variant="body1" color="textSecondary" align="center" style={{ marginTop: '200px' }}>
            No correlation data available.
          </Typography>
        ) : (
          <HeatMap
            xLabels={xLabels}
            yLabels={yLabels}
            data={heatmapData}
            height={40}
            squares
            onClick={(x, y) => {
              // Navigate to StockPage with selected stock
              navigate(`/?stock=${xLabels[x]}`);
            }}
            cellStyle={(background, value, min, max, data, x, y) => {
              return {
                background: `rgb(255, ${255 - Math.round((value + 1) * 127.5)}, ${255 - Math.round((value + 1) * 127.5)})`,
                fontSize: '14px',
                color: value > 0.5 ? 'white' : 'black',
                cursor: 'pointer'
              };
            }}
            cellRender={value => typeof value === 'number' ? value.toFixed(2) : value}
          />
        )}
      </div>
    </Paper>
  );
};

export default CustomHeatmap;