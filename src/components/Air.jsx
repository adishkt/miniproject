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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Typography, ButtonGroup, Button } from "@mui/material";
import "./air1.css";

const geoUrl = "/features.json";  // Your geo features file

const colorScale = scaleLinear()
  .domain([0, 5000000, 10000000, 15000000, 20000000, 25000000, 30000000, 35000000])
  .range([
    "#E6FFE6", // Very Light Green
    "#CCFFCC", // Pale Mint Green
    "#B3FFB3", // Soft Pastel Green
    "#99FF99", // Light Lime Green
    "#80FF80", // Mild Green
    "#66FF66", // Fresh Green
    "#4DFF4D", // Soft Bright Green
    "#33FF33"  // Light Vibrant Green
  ]);








const MapChart = () => {
  const [data, setData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [year, setYear] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

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

  // Filter data based on selected year
  const filteredData = data.filter((d) => {
    return !year || d.year === year;
  });

  const handleDateChange = (date) => {
    if (date) {
      setYear(date.year());
    }
  };

  const handleMouseEnter = (event, geo, d) => {
    const countryName = geo.properties.name;
    const countryData = d ? parseFloat(d.predicted_emission) : "No data";
    setTooltipContent(`${countryName}: ${countryData} °C`);
    setTooltipPosition({ x: event.pageX, y: event.pageY });
  };

  const handleMouseLeave = () => setTooltipContent("");

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev * 1.5, 10));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev / 1.5, 1));

  // If filteredData is empty, display a message
  if (filteredData.length === 0) {
    return <Typography>No data available for the selected year</Typography>;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Typography variant="h3" component="div" sx={{ color: "white", fontFamily: "fantasy", paddingTop: "20px" }}>
        Surface temperature
      </Typography>
      <br />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Year"
          views={["year"]}
          onChange={handleDateChange}
          sx={{ width: "420px", backgroundColor: "yellow" }}
        />
        <h1>Selected Year: {year}</h1>
      </LocalizationProvider>

      <ButtonGroup style={{ margin: "10px" }}>
        <Button onClick={handleZoomIn}>Zoom In</Button>
        <Button onClick={handleZoomOut}>Zoom Out</Button>
      </ButtonGroup>

      <div className="legend">
          <div className="legend-gradient">
          <div className="legend-labels">
    {[0, 5000000, 10000000, 15000000, 20000000, 25000000, 30000000, 35000000].map((value, index) => (
      <span key={index} className="legend-label">{value}</span>
            ))}
          </div>
        </div>
        
        
</div>


      <ComposableMap projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}>
        <ZoomableGroup zoom={zoomLevel}>
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
                        hover: { outline: "none", fill: "#FF5722" },
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

      {tooltipContent && (
        <div
          style={{
            position: "absolute",
            top: tooltipPosition.y + 10,
            left: tooltipPosition.x + 10,
            backgroundColor: "black",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            pointerEvents: "none"
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default MapChart;
