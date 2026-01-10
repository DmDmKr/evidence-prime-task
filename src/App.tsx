import { useState, useRef } from "react";
import "./App.css";
import { downloadSVG } from "./utils/converterUtils";
import RunicRepresentation from "./components/RunicRepresentation";

const App = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("0");
  const [numberToConvert, setNumberToConvert] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const handleConvert = () => {
    const numValue = parseInt(inputValue, 10);

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

    setNumberToConvert(numValue);
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConvert();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="app-container">
      <h1>Number to Runes Converter</h1>

      <div className="input-section">
        <label htmlFor="number-input">Enter a number (0-9999):</label>
        <div className="input-group">
          <input
            id="number-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={handleInputChange}
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
        <RunicRepresentation ref={svgRef} number={numberToConvert} />
      </div>
      <button
        onClick={() => downloadSVG(svgRef, numberToConvert)}
        className="download-button"
      >
        Download SVG
      </button>
    </div>
  );
};

export default App;
