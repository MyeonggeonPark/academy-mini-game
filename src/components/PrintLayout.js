import React from 'react';
import './PrintLayout.css';

/**
 * PrintLayout component - Optimizes content for printing
 * 
 * This component provides a print-specific layout wrapper that:
 * - Removes navigation elements in print view
 * - Sets appropriate margins and page breaks
 * - Ensures content fits properly on standard paper sizes
 * 
 * Requirements: 3.1, 3.2
 */
function PrintLayout({ children, type = 'worksheet' }) {
  return (
    <div className={`print-layout ${type}`}>
      {/* Main content area - no additional headers or footers */}
      <div className="print-content">
        {children}
      </div>
    </div>
  );
}

export default PrintLayout;