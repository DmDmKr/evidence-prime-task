import { useState, useRef } from 'react'
import './App.css'

const App = () => {
  const [number, setNumber] = useState<number>(0)
  const [error, setError] = useState<string>('')
  const svgRef = useRef<SVGSVGElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Handle empty input
    if (value === '') {
      setNumber(0)
      setError('')
      return
    }

    const numValue = parseInt(value, 10)

    // Validate input
    if (isNaN(numValue)) {
      setError('Please enter a valid number')
      return
    }

    if (numValue < 0) {
      setError('Number must be greater than or equal to 0')
      return
    }

    if (numValue > 9999) {
      setError('Number must be less than or equal to 9999')
      return
    }

    setNumber(numValue)
    setError('')
  }

  const downloadSVG = () => {
    if (!svgRef.current) return

    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)
    
    const downloadLink = document.createElement('a')
    downloadLink.href = svgUrl
    downloadLink.download = `number-${number}.svg`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(svgUrl)
  }

  return (
    <div className="app-container">
      <h1>Number to SVG Converter</h1>
      
      <div className="input-section">
        <label htmlFor="number-input">Enter a number (0-9999):</label>
        <input
          id="number-input"
          type="number"
          min="0"
          max="9999"
          value={number}
          onChange={handleInputChange}
          className={error ? 'error' : ''}
        />
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="svg-section">
        <svg 
          ref={svgRef}
          width="400" 
          height="150" 
          viewBox="0 0 400 150"
          className="runic-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="150" fill="#1a1a1a" rx="8" />
          <text 
            x="200" 
            y="90" 
            fontSize="48" 
            fill="#646cff" 
            textAnchor="middle"
            fontFamily="system-ui, Arial, sans-serif"
          >
            {number}
          </text>
        </svg>
      </div>

      <button onClick={downloadSVG} className="download-button">
        Download SVG
      </button>
    </div>
  )
}

export default App
