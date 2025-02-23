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
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Typography } from "@mui/material";

const geoUrl = "/features.json";

const colorScale = scaleLinear()
  .domain([0.29, 0.68])
  .range(["#ffedea", "#ff5233"]);

const MapChart = () => {
  const [data, setData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState(""); // Tooltip content
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // Tooltip position

  useEffect(() => {
    csv(`/v.csv`).then((data) => {
      setData(data);
    });
  }, []);


  const [selectedDate, setSelectedDate] = useState(null);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
      setYear(date.year());   // Extract year
      setMonth(date.month() + 1); // Extract month (month() returns 0-indexed value)
    }
  };

  const handleMouseEnter = (event, geo, d) => {
    const countryName = geo.properties.name; // Country name from GeoJSON
    // Find the country data based on ISO3 code
    const countryData = d ? d[year] : null;
    
    // If no data is found, display "No data"
    const value = countryData !== null ? countryData : "No data"; 
    setTooltipContent(`${countryName}: ${value}`);
    setTooltipPosition({ x: event.pageX, y: event.pageY });
  };

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.pageX, y: event.pageY }); // Update position
  };

  const handleMouseLeave = () => {
    setTooltipContent(""); // Hide tooltip when mouse leaves
  };

  return (
    <div style={{ position: "relative",width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center" }}>
          <Typography variant="h1" component="div" sx={{ flexGrow: 1, color:"black", fontFamily:"fantasy",paddingTop:"20px"}}>
              Climate change prediction
            </Typography>
<br></br><br></br>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Select Month & Year"
        views={["month", "year"]}
        onChange={handleDateChange} // Handle change
        sx={{width:"420px",backgroundColor:"yellow"}}
      />
      <h1>Selected Year: {year}</h1>
      {/* <p>Selected Month: {month}</p> */}
    </LocalizationProvider>

      <div style={{ position: "relative",width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center" }}>
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147
        }}
      >
        <Sphere stroke="#00000" strokeWidth={0.5} />  ##E4E5E6
        <Graticule stroke="#00000" strokeWidth={0.5} />
        {data.length > 0 && (
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // Find matching country data by ISO3 code
                const d = data.find((s) => s.ISO3 === geo.id);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={d ? colorScale(d["2017"]) : "#F5F4Fb"}
                    onMouseEnter={(event) => handleMouseEnter(event, geo, d)}
                    onMouseMove={handleMouseMove} // To track mouse movement
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#FF5722" }, // Highlight on hover
                      pressed: { outline: "none" }
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
            padding: "10px 10px",
            borderRadius: "5px",
            boxShadow: "0 4px 6px rgba(255, 5, 5, 0.65)",
            pointerEvents: "none",
            fontSize: "32px"
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
