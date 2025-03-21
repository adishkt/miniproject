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
import { Typography, MenuItem, Select, ButtonGroup, Button } from "@mui/material";
import "./air.css";

const geoUrl = "/features.json";

const colorScale = scaleLinear()
  .domain([-15, 0, 15, 30, 45, 60, 75, 95])
  .range(["#87CEEB", "#B0E0E6", "#FFE4B5", "#FFDAB9", "#FFA07A", "#FF8C00", "#FF6347", "#FF4500"]);

const monthSets = [
  { value: "jun-jul-aug", label: "Jun/Jul/Aug" },
  { value: "dec-jan-feb", label: "Dec/Jan/Feb" },
  { value: "mar-apr-may", label: "Mar/Apr/May" },
  { value: "sep-oct-nov", label: "Sep/Oct/Nov" },
];

const generateYearRanges = (start, end, step) => {
  let ranges = [];
  for (let i = start; i <= end; i += step) {
    let rangeEnd = i + step - 1;
    if (rangeEnd > end) rangeEnd = end;
    ranges.push({ value: `${i}-${rangeEnd}`, label: `${i}-${rangeEnd}` });
  }
  return ranges;
};

const yearRanges = generateYearRanges(1986, 2099, 20);

const MapChart = () => {
  const [data, setData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const [selectedYearRange, setSelectedYearRange] = useState("");
  const [selectedMonthSet, setSelectedMonthSet] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    csv(`/Temperature Predictions from Model 1.1.csv`).then((data) => {
      setData(data);
    });
  }, []);

  const handleMouseEnter = (event, geo, d) => {
    const countryName = geo.properties.name;
    const predicted_temperature = d ? parseFloat(d[`${selectedYearRange}_${selectedMonthSet}`]) : null;
    const value = predicted_temperature !== null && !isNaN(predicted_temperature)
      ? `Predicted Temp: ${predicted_temperature}°C`
      : "No data available";

    setTooltipContent(`${countryName}: ${value}`);
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
      <Typography variant="h1" sx={{ color: "white", fontFamily: "fantasy", paddingTop: "20px" }}>
        Climate Change Prediction
      </Typography>

      <Select
        value={selectedYearRange}
        onChange={(e) => setSelectedYearRange(e.target.value)}
        displayEmpty
        sx={{ width: "300px", backgroundColor: "yellow", margin: "20px" }}
      >
        <MenuItem value="" disabled>Select Year Range</MenuItem>
        {yearRanges.map((year) => (
          <MenuItem key={year.value} value={year.value}>
            {year.label}
          </MenuItem>
        ))}
      </Select>

      <Select
        value={selectedMonthSet}
        onChange={(e) => setSelectedMonthSet(e.target.value)}
        displayEmpty
        sx={{ width: "300px", backgroundColor: "yellow", marginBottom: "20px" }}
      >
        <MenuItem value="" disabled>Select Months</MenuItem>
        {monthSets.map((month) => (
          <MenuItem key={month.value} value={month.value}>
            {month.label}
          </MenuItem>
        ))}
      </Select>

      <ButtonGroup>
        <Button onClick={handleZoomIn}>Zoom In</Button>
        <Button onClick={handleZoomOut}>Zoom Out</Button>
      </ButtonGroup>

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
                  const d = data.find((s) => s.ISO3 === geo.id);
                  const fillColor = d && selectedYearRange && selectedMonthSet
                    ? colorScale(parseFloat(d[`${selectedYearRange}_${selectedMonthSet}`]))
                    : "#F5F4Fb";
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      onMouseEnter={(event) => handleMouseEnter(event, geo, d)}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "#FF5722" },
                        pressed: { outline: "none" },
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
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 4px 6px rgba(255, 5, 5, 0.65)",
            pointerEvents: "none",
            fontSize: "16px",
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default MapChart;
