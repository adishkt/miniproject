import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule
} from "react-simple-maps";
import { Typography, MenuItem, Select } from "@mui/material";

const geoUrl = "/features.json";

const colorScale = scaleLinear()
  .domain([0.29, 0.68])
  .range(["#ffedea", "#ff5233"]);

// Predefined month sets
const monthSets = [
  { value: "jun-jul-aug", label: "Jun/Jul/Aug" },
  { value: "dec-jan-feb", label: "Dec/Jan/Feb" },
  { value: "mar-apr-may", label: "Mar/Apr/May" },
  { value: "sep-oct-nov", label: "Sep/Oct/Nov" },
];

// Generate 20-year ranges dynamically
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

  // State for year range & month selection
  const [selectedYearRange, setSelectedYearRange] = useState("");
  const [selectedMonthSet, setSelectedMonthSet] = useState("");

  useEffect(() => {
    csv(`/v.csv`).then((data) => {
      setData(data);
    });
  }, []);

  const handleMouseEnter = (event, geo, d) => {
    const countryName = geo.properties.name;
    const countryData = d ? d[selectedYearRange] : null;
    const value = countryData !== null ? countryData : "No data";
    setTooltipContent(`${countryName}: ${value}`);
    setTooltipPosition({ x: event.pageX, y: event.pageY });
  };

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.pageX, y: event.pageY });
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Typography variant="h1" sx={{ color: "black", fontFamily: "fantasy", paddingTop: "20px" }}>
        Climate Change Prediction
      </Typography>

      {/* Year Range Selector */}
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

      {/* Month Set Selector */}
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

      {/* World Map */}
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <ComposableMap projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}>
          <Sphere stroke="#00000" strokeWidth={0.5} />
          <Graticule stroke="#00000" strokeWidth={0.5} />
          {data.length > 0 && (
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const d = data.find((s) => s.ISO3 === geo.id);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={d ? colorScale(d[selectedYearRange]) : "#F5F4Fb"}
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
        </ComposableMap>

        {/* Tooltip */}
        {tooltipContent && (
          <div
            style={{
              position: "absolute",
              top: tooltipPosition.y + 10,
              left: tooltipPosition.x + 10,
              backgroundColor: "white",
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
    </div>
  );
};

export default MapChart;
