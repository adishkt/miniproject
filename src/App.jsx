import { useState } from 'react';
import './App.css';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
// import { ReactTooltip } from 'react-tooltip';  // Correct named import

const Url = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function App() {
  const [content, setContent] = useState("");  // Renamed for consistency
  return (
    <div
      className="App"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Map with Tooltip</h1>
      {/* ReactTooltip: This is now dynamically updated */}
      {/* <ReactTooltip>{content}</ReactTooltip> */}
      <div style={{ width: "1400px", borderStyle: "double" }}>
        <ComposableMap>
          <ZoomableGroup zoom={1}>
            <Geographies geography={Url}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    data-tip={geo.properties.NAME}  // Tooltip data dynamically set
                    onMouseEnter={() => {
                      const { NAME } = geo.properties;
                      setContent(`${NAME}`);  // Update tooltip content
                    }}
                    onMouseLeave={() => {
                      setContent("");  // Clear content on mouse leave
                    }}
                    style={{
                      default: {
                        fill: "black",  // Default fill color
                        outline: "none",  // No outline
                      },
                      hover: {
                        fill: "#F53",  // Color when hovering
                        outline: "none",
                      },
                    }}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
}

export default App;