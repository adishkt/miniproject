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
import "./air.css"

const geoUrl = "/features.json";

const colorScale = scaleLinear()
  .domain([-15, 0, 15, 30, 45, 60, 75, 95])
  .range(["#87CEEB", "#B0E0E6", "#FFE4B5", "#FFDAB9", "#FFA07A", "#FF8C00", "#FF6347", "#FF4500"]);

const MapChart = () => {
  const [data, setData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedDate, setSelectedDate] = useState(null);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    csv(`/Temperature Predictions from Model 1.1.csv`).then((data) => {
      console.log("CSV Data:", data);
      setData(data);
    });
  }, []);

  useEffect(() => {
    fetch(geoUrl)
      .then((response) => response.json())
      .then((geoData) => console.log("GeoJSON Data:", geoData));
  }, []);

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
      setYear(date.year());
      setMonth(date.month() + 1);
    }
  };

  const handleMouseEnter = (event, geo, d) => {
    const countryName = geo.properties.name;
    const countryData = d ? parseFloat(d.predicted_temperature) : "No data";
    setTooltipContent(`${countryName}: ${countryData} °C`);
    setTooltipPosition({ x: event.pageX, y: event.pageY });
  };

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.pageX, y: event.pageY });
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev * 1.5, 10));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev / 1.5, 1));

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Typography variant="h1" component="div" sx={{ color: "white", fontFamily: "fantasy", paddingTop: "20px" }}>
        Air Quality Index Prediction
      </Typography>
      <br />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Month & Year"
          views={["month", "year"]}
          onChange={handleDateChange}
          sx={{ width: "420px", backgroundColor: "yellow" }}
        />
        <h1>Selected Year: {year}</h1>
      </LocalizationProvider>

      <ButtonGroup style={{ margin: "10px" }}>
        <Button onClick={handleZoomIn}>Zoom In</Button>
        <Button onClick={handleZoomOut}>Zoom Out</Button>
      </ButtonGroup>

      <div style={{ display: "flex", position: "relative", width: "100%", justifyContent: "center" }}>
        <div className="legend">
          <div className="legend-gradient"></div>
          <div className="legend-labels">
            {[-15, 0, 15, 30, 45, 60, 75, 95].map((temp, index) => (
              <span key={index} className="legend-label">{temp}°C</span>
            ))}
          </div>
        </div>

        <ComposableMap projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}>
          <ZoomableGroup zoom={zoomLevel}>
            <Sphere stroke="#00000" strokeWidth={0.5} />
            <Graticule stroke="#00000" strokeWidth={0.5} />
            {data.length > 0 && (
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const d = data.find((s) => s.country === geo.properties.name);
                    const countryData = d ? parseFloat(d.predicted_temperature) : undefined;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={countryData !== undefined ? colorScale(countryData) : "#F5F4Fb"}
                        onMouseEnter={(event) => handleMouseEnter(event, geo, d)}
                        onMouseMove={handleMouseMove}
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
      </div>

      {tooltipContent && (
        <div
          style={{
            position: "absolute",
            top: tooltipPosition.y + 10,
            left: tooltipPosition.x + 10,
            backgroundColor: "black",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 4px 6px rgba(37, 36, 36, 0.1)",
            pointerEvents: "none",
            fontSize: "16px"
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default MapChart;
