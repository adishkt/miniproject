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

  const handleMouseEnter = (event, geo, d) => {
    const countryName = geo.properties.NAME; // Country name from GeoJSON
    // Find the country data based on ISO3 code
    const countryData = d ? d["2017"] : null;
    
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
    <div style={{ position: "relative" }}>
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147
        }}
      >
        <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
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
            padding: "5px 10px",
            borderRadius: "5px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            pointerEvents: "none",
            fontSize: "22px"
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default MapChart;
