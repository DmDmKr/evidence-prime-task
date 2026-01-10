import { useState, useRef } from "react";
import "./App.css";
import { downloadSVG } from "./utils/converterUtils";
import RunicRepresentation from "./components/RunicRepresentation";

const App = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [number, setNumber] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const handleConvert = () => {
    const value = inputRef.current?.value || "";
    const numValue = parseInt(value, 10);

    if (isNaN(numValue)) {
      setError("Please enter a valid number");
      return;
    }

    if (numValue < 0) {
      setError("Number must be greater than or equal to 0");
      return;
    }

    if (numValue > 9999) {
      setError("Number must be less than or equal to 9999");
      return;
    }

    setNumber(numValue);
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConvert();
    }
  };

  return (
    <div className="app-container">
      <h1>Number to Runes Converter</h1>

      <div className="input-section">
        <label htmlFor="number-input">Enter a number (0-9999):</label>
        <div className="input-group">
          <input
            ref={inputRef}
            id="number-input"
            type="number"
            min="0"
            max="9999"
            defaultValue="0"
            onChange={() => setError("")}
            onKeyDown={handleKeyPress}
            className={error ? "error" : ""}
          />
          <button onClick={handleConvert} className="convert-button">
            Convert
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="svg-section">
        <RunicRepresentation ref={svgRef} number={number} />
      </div>
      <button
        onClick={() => downloadSVG(svgRef, number)}
        className="download-button"
      >
        Download SVG
      </button>
    </div>
  );
};

export default App;
