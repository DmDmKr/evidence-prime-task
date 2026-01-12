import { useState, useRef } from "react";
import "./App.css";
import { downloadSVG } from "./utils/converterUtils";
import RunicRepresentation from "./components/RunicRepresentation";
import { MAX_NUMBER, MIN_NUMBER } from "./utils/runicNumberUtils";

const App = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [inputValue, setInputValue] = useState<string>("0");
  const [numberToConvert, setNumberToConvert] = useState<number>(MIN_NUMBER);
  const [error, setError] = useState<string>("");

  const handleConvert = () => {
    const numValue = parseInt(inputValue, 10);

    if (isNaN(numValue)) {
      setError("Please enter a valid number");
      return;
    }

    if (numValue < MIN_NUMBER) {
      setError(`Number must be greater than or equal to ${MIN_NUMBER}`);
      return;
    }

    if (numValue > MAX_NUMBER) {
      setError(`Number must be less than or equal to ${MAX_NUMBER}`);
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
        <label htmlFor="number-input">Enter a number (0-{MAX_NUMBER}):</label>
        <div className="input-group">
          <input
            id="number-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className={error ? "error" : ""}
          />
          <button
            onClick={handleConvert}
            className="convert-button"
            disabled={error !== ""}
          >
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
