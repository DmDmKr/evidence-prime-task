# Runic Number Converter

A React + TypeScript application that converts decimal numbers (0-9999) into their runic numeral representation and generates downloadable SVG images.

## Features

- **Number to Runes Conversion**: Convert any number from 0 to 9999 into runic representation
- **Dynamic SVG Rendering**: All paths are rendered in SVG, with CSS classes controlling visibility based on the number
- **Download Functionality**: Export the generated runic representation as a standalone SVG file
- **Input Validation on Intent**: Validation and error feedback triggered on explicit user action (Convert / pressing Enter)
- **Responsive Design**: Mobile-friendly interface with dark/light mode support

## Quick Start

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Usage

1. Enter a number between 0 and 9999 in the input field
2. Click the **Convert** button (or press Enter) to generate the runic representation
3. View the generated SVG image
4. Click **Download SVG** to save the image to your device

## Architecture & Design Decisions

### Component Structure

```
src/
├── components/
│   ├── RunicRepresentation.tsx    # SVG rendering component
│   └── RunicRepresentation.css    # Component-specific styles
├── utils/
│   ├── runicNumberUtils.ts        # Runic number conversion logic
│   └── converterUtils.ts          # SVG download utilities
├── App.tsx                        # Main application component
└── App.css                        # Global application styles
```

### Key Technical Decisions

#### State Management

- **Two-state approach**: Separate `inputValue` (string) and `numberToConvert` (number) to avoid re-rendering the runic SVG on every keystroke while keeping the input responsive
- **Number for actual conversion state**: Once validated, `numberToConvert` is stored as a number type, avoiding repeated parsing and validation logic in child components and download utilities
- **Explicit conversion**: The Convert button gives users control over when to generate the runic representation, preventing flickering through partial numbers like 1 → 12 → 123
- **Controlled components**: Input is fully controlled for better validation and user feedback
- **Presentational component**: The runic SVG renderer is a pure, stateless component that depends only on a validated number and contains no parsing or validation logic

#### Performance Considerations

- Runic representation only updates on explicit user action (Convert button click)
- No unnecessary re-renders during typing
- Efficient SVG generation and cloning for download

#### Accessibility

- Semantic HTML with proper labels
- ARIA attributes for SVG content (`role="img"`, `aria-labelledby`)
- Keyboard navigation support (Enter key to convert)
- Clear error messaging with visual feedback

### Styling Approach

- **Component-scoped CSS**: Current implementation uses individual stylesheets per component (`App.css`, `RunicRepresentation.css`) for modularity and maintainability.
- **Responsive design**: Mobile-first layout using CSS media queries for breakpoints
- **Dark/light mode support**: Leveraging `prefers-color-scheme` for automatic theme adjustment
- **Future scalability**: For larger projects, CSS Modules or a UI library (e.g., MUI or Chakra UI) could be adopted to automatically scope styles, ensure consistency, and improve accessibility.

## Tech Stack

- **React 19** - Latest React with modern features (ref as props)
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **file-saver** - Client-side file download utility

## Implementation Notes

### Runic Number System

The application implements a positional numeral system where:

- Numbers are represented visually using SVG paths
- Position determines magnitude (ones, tens, hundreds, thousands)
- CSS classes control visibility of specific runic elements

### SVG Download Process

1. Clone the rendered SVG element
2. Filter visible paths based on computed styles
3. Apply explicit stroke attributes for consistent rendering
4. Generate blob and trigger download with descriptive filename
