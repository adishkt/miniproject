import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup
} from "react-simple-maps";
import { Typography, IconButton, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import "./map.css";

const geoUrl = "/features.json";

const colorScale = scaleLinear()
  .domain([0, 5000000, 10000000, 15000000, 20000000, 25000000, 30000000, 35000000])
  .range([
    "#fff8e1", // Very light pastel yellow for lowest emissions
    "#ffe0b2", // Light pastel orange
    "#ffcc80", // Medium-light pastel orange
    "#ffb74d", // Medium pastel orange
    "#ffa726", // Medium-dark pastel orange
    "#ff9800", // Dark pastel orange
    "#ff8f00", // Darker pastel orange
    "#ff6f00"  // Darkest orange (but still visible)
  ]);

const MapChart = () => {
  const [data, setData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [year, setYear] = useState("");
  const [zoomLevel, setZoomLevel] = useState(0.8);

  useEffect(() => {
    csv(`/ghg_predictions.csv`).then((csvData) => {
      const formattedData = csvData.map((d) => ({
        ...d,
        year: parseInt(d.year, 10),
        predicted_emission: parseFloat(d.predicted_emission),
      }));
      setData(formattedData);
    }).catch((error) => {
      console.error("Error loading CSV data:", error);
    });
  }, []);

  const filteredData = data.filter((d) => {
    return !year || d.year === parseInt(year);
  });

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMouseEnter = (event, geo, d) => {
    const countryName = geo.properties.name;
    const countryData = d ? parseFloat(d.predicted_emission) : "No data";
    setTooltipContent(`${countryName}: ${countryData}`);
    setTooltipPosition({ x: event.pageX, y: event.pageY });
  };

  const handleMouseLeave = () => setTooltipContent(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev * 1.5, 10));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev / 1.5, 1));

  // Get unique years from data
  const years = [...new Set(data.map(d => d.year))].sort((a, b) => b - a);

  return (
    <div style={{ 
      position: "relative", 
      width: "100%", 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "flex-start", 
      alignItems: "center",
      padding: "10px 0"
    }}>
      <div style={{ 
        width: "100%", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 1,
          marginTop: "10px"
        }}>
          <FormControl size="small" sx={{ minWidth: 100, '& .MuiInputBase-root': { height: '32px' } }}>
            <InputLabel sx={{ color: 'white', fontSize: '0.8rem', transform: 'translate(14px, 8px) scale(1)' }}>Year</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={handleYearChange}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.8rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                }
              }}
            >
              <MenuItem value="" sx={{ fontSize: '0.8rem' }}>All Years</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year} sx={{ fontSize: '0.8rem' }}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: 'calc(100vh - 200px)', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        margin: '0 20px'
      }}>
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          right: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          zIndex: 1000
        }}>
          <IconButton 
            onClick={handleZoomIn}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            <AddIcon />
          </IconButton>
          <IconButton 
            onClick={handleZoomOut}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            <RemoveIcon />
          </IconButton>
        </div>

        <ComposableMap projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}>
          <ZoomableGroup 
            zoom={zoomLevel}
          >
            <Sphere stroke="#00000" strokeWidth={0.5} />
            <Graticule stroke="#00000" strokeWidth={0.5} />
            {filteredData.length > 0 && (
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const d = filteredData.find((s) => s.country === geo.properties.name);
                    const countryData = d ? parseFloat(d.predicted_emission) : undefined;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={countryData !== undefined ? colorScale(countryData) : "#F5F4Fb"}
                        onMouseEnter={(event) => handleMouseEnter(event, geo, d)}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          default: { outline: "none" },
                          hover: { 
                            outline: "none", 
                            opacity: 0.7,
                            transition: "opacity 0.2s"
                          },
                          pressed: { outline: "none" }
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            )}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {tooltipContent && (
        <div
          style={{
            position: "absolute",
            top: tooltipPosition.y + 10,
            left: tooltipPosition.x + 10,
            backgroundColor: "rgba(44, 62, 80, 0.9)",
            color: "#ECF0F1",
            padding: "10px",
            borderRadius: "5px",
            pointerEvents: "none",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default MapChart;
