import React, { useState } from 'react';
import PrintLayout from './PrintLayout';
import './MazeGenerator.css';

// Recursive backtracking maze generation algorithm
const generateMazeGrid = (width, height) => {
  // Initialize grid with all walls
  const grid = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push({
        north: false,
        east: false,
        south: false,
        west: false,
        visited: false
      });
    }
    grid.push(row);
  }

  // Directions: North, East, South, West
  const directions = [
    { dx: 0, dy: -1, current: 'north', opposite: 'south' },
    { dx: 1, dy: 0, current: 'east', opposite: 'west' },
    { dx: 0, dy: 1, current: 'south', opposite: 'north' },
    { dx: -1, dy: 0, current: 'west', opposite: 'east' }
  ];

  // Shuffle array utility
  const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Recursive backtracking function
  const carvePassages = (x, y) => {
    grid[y][x].visited = true;
    
    const shuffledDirections = shuffle(directions);
    
    for (const direction of shuffledDirections) {
      const newX = x + direction.dx;
      const newY = y + direction.dy;
      
      // Check bounds
      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        const neighbor = grid[newY][newX];
        
        if (!neighbor.visited) {
          // Carve passage between current cell and neighbor
          grid[y][x][direction.current] = true;
          grid[newY][newX][direction.opposite] = true;
          
          // Recursively carve from neighbor
          carvePassages(newX, newY);
        }
      }
    }
  };

  // Start carving from top-left corner
  carvePassages(0, 0);

  // Remove visited property as it's not needed in final grid
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      delete grid[y][x].visited;
    }
  }

  return grid;
};

// Component to render the maze visually
const MazeDisplay = ({ maze }) => {
  // Calculate cell sizes with maximum SVG size constraints
  const calculateCellSize = () => {
    // Maximum container dimensions (responsive)
    const maxContainerWidth = Math.min(800, window.innerWidth - 40);
    const maxContainerHeight = Math.min(800, window.innerHeight - 200);
    
    // Calculate maximum cell size based on container constraints
    const maxCellFromWidth = Math.floor(maxContainerWidth / maze.width);
    const maxCellFromHeight = Math.floor(maxContainerHeight / maze.height);
    const maxAllowedCell = Math.min(maxCellFromWidth, maxCellFromHeight);
    
    // Ensure minimum readable size based on maze dimensions
    if (maze.width >= 80) {
      return Math.max(6, Math.min(maxAllowedCell, 10));
    } else if (maze.width >= 60) {
      return Math.max(8, Math.min(maxAllowedCell, 12));
    } else if (maze.width >= 40) {
      return Math.max(10, Math.min(maxAllowedCell, 16));
    } else if (maze.width >= 30) {
      return Math.max(12, Math.min(maxAllowedCell, 20));
    } else {
      return Math.max(16, Math.min(maxAllowedCell, 28));
    }
  };
  
  const cellSize = calculateCellSize();
  const wallThickness = Math.max(1, Math.min(4, Math.ceil(cellSize / 8)));
  
  // Calculate proper SVG dimensions with padding
  const svgWidth = maze.width * cellSize + wallThickness * 2;
  const svgHeight = maze.height * cellSize + wallThickness * 2;
  
  return (
    <div className="maze-display">
      <svg 
        width={svgWidth} 
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="maze-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Draw the maze grid */}
        {maze.grid.map((row, y) =>
          row.map((cell, x) => (
            <g key={`${x}-${y}`}>
              {/* Draw walls for each cell */}
              {/* North wall */}
              {!cell.north && (
                <line
                  x1={x * cellSize + wallThickness}
                  y1={y * cellSize + wallThickness}
                  x2={(x + 1) * cellSize + wallThickness}
                  y2={y * cellSize + wallThickness}
                  stroke="#000"
                  strokeWidth={wallThickness}
                  strokeLinecap="square"
                />
              )}
              
              {/* East wall */}
              {!cell.east && (
                <line
                  x1={(x + 1) * cellSize + wallThickness}
                  y1={y * cellSize + wallThickness}
                  x2={(x + 1) * cellSize + wallThickness}
                  y2={(y + 1) * cellSize + wallThickness}
                  stroke="#000"
                  strokeWidth={wallThickness}
                  strokeLinecap="square"
                />
              )}
              
              {/* South wall */}
              {!cell.south && (
                <line
                  x1={x * cellSize + wallThickness}
                  y1={(y + 1) * cellSize + wallThickness}
                  x2={(x + 1) * cellSize + wallThickness}
                  y2={(y + 1) * cellSize + wallThickness}
                  stroke="#000"
                  strokeWidth={wallThickness}
                  strokeLinecap="square"
                />
              )}
              
              {/* West wall */}
              {!cell.west && (
                <line
                  x1={x * cellSize + wallThickness}
                  y1={y * cellSize + wallThickness}
                  x2={x * cellSize + wallThickness}
                  y2={(y + 1) * cellSize + wallThickness}
                  stroke="#000"
                  strokeWidth={wallThickness}
                  strokeLinecap="square"
                />
              )}
            </g>
          ))
        )}
        
        {/* Draw outer boundary walls as a rectangle */}
        <rect
          x={wallThickness / 2}
          y={wallThickness / 2}
          width={maze.width * cellSize + wallThickness}
          height={maze.height * cellSize + wallThickness}
          fill="none"
          stroke="#000"
          strokeWidth={wallThickness}
          strokeLinejoin="miter"
        />
        
        {/* Start marker (green circle) */}
        <circle
          cx={maze.start.x * cellSize + cellSize/2 + wallThickness}
          cy={maze.start.y * cellSize + cellSize/2 + wallThickness}
          r={Math.max(4, cellSize/3)}
          fill="#28a745"
          stroke="#fff"
          strokeWidth={Math.max(1, wallThickness/2)}
        />
        
        {/* Start label */}
        <text
          x={maze.start.x * cellSize + cellSize/2 + wallThickness}
          y={maze.start.y * cellSize + cellSize/2 + wallThickness + 2}
          textAnchor="middle"
          fontSize={Math.max(8, cellSize/3)}
          fill="#fff"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
        </text>
        
        {/* End marker (red circle) */}
        <circle
          cx={maze.end.x * cellSize + cellSize/2 + wallThickness}
          cy={maze.end.y * cellSize + cellSize/2 + wallThickness}
          r={Math.max(4, cellSize/3)}
          fill="#dc3545"
          stroke="#fff"
          strokeWidth={Math.max(1, wallThickness/2)}
        />
        
        {/* End label */}
        <text
          x={maze.end.x * cellSize + cellSize/2 + wallThickness}
          y={maze.end.y * cellSize + cellSize/2 + wallThickness + 2}
          textAnchor="middle"
          fontSize={Math.max(8, cellSize/3)}
          fill="#fff"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
        </text>
      </svg>
      
      {/* Legend */}
      <div className="maze-legend">
        <div className="legend-item">
          <div className="legend-marker start-marker"></div>
          <span>START</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker end-marker"></div>
          <span>FINISH</span>
        </div>
      </div>
    </div>
  );
};

function MazeGenerator() {
  const [config, setConfig] = useState({
    size: 20
  });
  const [maze, setMaze] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationTouched, setValidationTouched] = useState({
    size: false
  });

  const handleSizeChange = (e) => {
    const value = parseInt(e.target.value);
    setConfig(prev => ({ ...prev, size: value }));
    setValidationTouched(prev => ({ ...prev, size: true }));
    validateSize(value);
    setShowSuccess(false);
  };

  const validateSize = (size) => {
    if (size < 10 || size > 100 || size % 10 !== 0) {
      setErrors(prev => ({
        ...prev,
        size: 'Size must be between 10 and 100 in 10-unit increments (10, 20, 30, etc.)'
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        size: null
      }));
    }
  };

  const isFormValid = () => {
    return !errors.size && config.size >= 10 && config.size <= 100 && config.size % 10 === 0;
  };

  const generateMaze = async () => {
    if (!isFormValid()) return;

    setIsLoading(true);
    setMaze(null);
    setShowSuccess(false);
    setErrors(prev => ({ ...prev, generation: null }));

    try {
      // Simulate loading time for better UX (longer for larger mazes)
      const loadingTime = Math.min(1000, 300 + (config.size * 10));
      await new Promise(resolve => setTimeout(resolve, loadingTime));
      
      // Generate maze using our own recursive backtracking algorithm
      const grid = generateMazeGrid(config.size, config.size);

      // Find a path from start to end to ensure solvability
      const solution = findPath(grid, { x: 0, y: 0 }, { x: config.size - 1, y: config.size - 1 });
      
      if (!solution || solution.length === 0) {
        throw new Error('Generated maze has no solution path');
      }

      const newMaze = {
        width: config.size,
        height: config.size,
        grid: grid,
        start: { x: 0, y: 0 },
        end: { x: config.size - 1, y: config.size - 1 },
        solution: solution
      };

      setMaze(newMaze);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error generating maze:', error);
      setErrors(prev => ({
        ...prev,
        generation: `Failed to generate maze: ${error.message}. Please try again.`
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Simple pathfinding to verify maze has a solution
  const findPath = (grid, start, end) => {
    const visited = new Set();
    const queue = [{ x: start.x, y: start.y, path: [start] }];
    
    while (queue.length > 0) {
      const { x, y, path } = queue.shift();
      const key = `${x},${y}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      if (x === end.x && y === end.y) {
        return path;
      }
      
      const cell = grid[y][x];
      
      // Check all four directions
      const directions = [
        { dx: 0, dy: -1, passage: 'north' }, // North
        { dx: 1, dy: 0, passage: 'east' },   // East
        { dx: 0, dy: 1, passage: 'south' },  // South
        { dx: -1, dy: 0, passage: 'west' }   // West
      ];
      
      for (const dir of directions) {
        const newX = x + dir.dx;
        const newY = y + dir.dy;
        const newKey = `${newX},${newY}`;
        
        // Check bounds
        if (newX < 0 || newX >= grid[0].length || newY < 0 || newY >= grid.length) {
          continue;
        }
        
        // Check if there's a passage in this direction
        if (cell[dir.passage] && !visited.has(newKey)) {
          queue.push({
            x: newX,
            y: newY,
            path: [...path, { x: newX, y: newY }]
          });
        }
      }
    }
    
    return null; // No path found
  };

  // Enhanced print functionality
  const handlePrint = () => {
    // Add print-specific styles to force portrait orientation
    const printStyles = document.createElement('style');
    printStyles.textContent = `
      @media print {
        @page { 
          size: A4 portrait !important; 
          orientation: portrait !important;
          margin: 10mm !important;
        }
        body { 
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(printStyles);
    
    // Trigger browser print dialog
    window.print();
    
    // Clean up styles after printing
    setTimeout(() => {
      document.head.removeChild(printStyles);
    }, 1000);
  };

  // Print preview functionality
  const handlePrintPreview = () => {
    // Add print-specific styles to force portrait orientation
    const printStyles = document.createElement('style');
    printStyles.textContent = `
      @media print {
        @page { 
          size: A4 portrait !important; 
          orientation: portrait !important;
          margin: 10mm !important;
        }
        body { 
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(printStyles);
    
    // Open print preview by triggering print dialog
    // Modern browsers show print preview by default
    window.print();
    
    // Clean up styles after printing
    setTimeout(() => {
      document.head.removeChild(printStyles);
    }, 1000);
  };

  // Generate size options in 10-unit increments
  const sizeOptions = [];
  for (let i = 10; i <= 100; i += 10) {
    sizeOptions.push(i);
  }

  return (
    <div className="maze-generator">
      <h1>Maze Generator</h1>
      
      <div className="config-section">
        <h2>Configuration</h2>
        
        {/* Size Selection */}
        <div className="form-group">
          <label className="form-label">
            Maze Size (width × height):
          </label>
          <select 
            value={config.size} 
            onChange={handleSizeChange}
            className={`form-select ${validationTouched.size ? (errors.size ? 'error' : 'valid') : ''}`}
            disabled={isLoading}
          >
            {sizeOptions.map(size => (
              <option key={size} value={size}>
                {size} × {size}
              </option>
            ))}
          </select>
          {validationTouched.size && errors.size && <div className="error-message">{errors.size}</div>}
          {validationTouched.size && !errors.size && (
            <div className="success-message">✓ {config.size}×{config.size} maze selected</div>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={generateMaze}
          disabled={!isFormValid() || isLoading}
          className="generate-button"
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Generating {config.size}×{config.size} Maze...
            </>
          ) : (
            'Generate Maze'
          )}
        </button>

        {/* Success Message */}
        {showSuccess && (
          <div className="success-banner">
            ✅ Successfully generated {config.size}×{config.size} maze puzzle!
          </div>
        )}

        {/* Generation Error */}
        {errors.generation && (
          <div className="error-banner">
            ❌ {errors.generation}
          </div>
        )}
      </div>

      {/* Maze Display Area */}
      <div id="maze-display">
        {maze ? (
          <div>
            <div className="no-print action-buttons">
              <button
                onClick={handlePrint}
                className="print-button"
                title="Print maze"
              >
                🖨️ Print Maze
              </button>
              <button
                onClick={handlePrintPreview}
                className="print-preview-button"
                title="Print preview"
              >
                👁️ Print Preview
              </button>
              <button
                onClick={() => setMaze(null)}
                className="clear-button"
                title="Clear maze"
              >
                🗑️ Clear Maze
              </button>
            </div>

            <PrintLayout 
              type="maze-worksheet"
            >
              <div className="maze-worksheet">
                <div className="maze-header">
                  <h1 className="maze-title">
                    Maze Puzzle
                  </h1>
                  <p className="maze-info">
                    Name: _________________ Date: _________________
                  </p>
                  <p className="maze-instructions">
                    Instructions: Find the path from START to FINISH. Draw your solution with a pencil.
                  </p>
                  <p className="maze-size-info">
                    Maze Size: {maze.width} × {maze.height}
                  </p>
                </div>

                <div className="maze-container">
                  <MazeDisplay maze={maze} />
                </div>

                <div className="maze-footer">
                  <p>Generated on {new Date().toLocaleDateString()} | Size: {maze.width}×{maze.height}</p>
                </div>
              </div>
            </PrintLayout>
          </div>
        ) : (
          <div className="empty-state">
            {isLoading ? (
              <div className="loading-state">
                <span className="loading-spinner large"></span>
                <p>Generating your maze...</p>
              </div>
            ) : (
              <p>Configure the settings above and click "Generate Maze" to create your maze puzzle.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MazeGenerator;