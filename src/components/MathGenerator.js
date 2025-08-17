import React, { useState } from 'react';
import PrintLayout from './PrintLayout';
import './MathGenerator.css';

function MathGenerator() {
  const [config, setConfig] = useState({
    digits: 1,
    operations: ['+'],
    problemCount: 10
  });
  const [problems, setProblems] = useState([]);
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationTouched, setValidationTouched] = useState({
    digits: false,
    operations: false,
    problemCount: false
  });

  const handleDigitsChange = (e) => {
    const value = parseInt(e.target.value);
    setConfig(prev => ({ ...prev, digits: value }));
    setValidationTouched(prev => ({ ...prev, digits: true }));
    validateDigits(value);
    setShowSuccess(false);
  };

  const handleOperationChange = (operation) => {
    setConfig(prev => {
      const operations = prev.operations.includes(operation)
        ? prev.operations.filter(op => op !== operation)
        : [...prev.operations, operation];
      
      setValidationTouched(prevTouched => ({ ...prevTouched, operations: true }));
      validateOperations(operations);
      setShowSuccess(false);
      return { ...prev, operations };
    });
  };

  const handleProblemCountChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setConfig(prev => ({ ...prev, problemCount: value }));
    setValidationTouched(prev => ({ ...prev, problemCount: true }));
    validateProblemCount(value);
    setShowSuccess(false);
  };

  const validateDigits = (digits) => {
    setErrors(prev => ({
      ...prev,
      digits: (digits < 1 || digits > 4) ? 'Digits must be between 1 and 4' : null
    }));
  };

  const validateOperations = (operations) => {
    setErrors(prev => ({
      ...prev,
      operations: operations.length === 0 ? 'At least one operation must be selected' : null
    }));
  };

  const validateProblemCount = (count) => {
    let errorMessage = null;
    if (isNaN(count) || count === 0) {
      errorMessage = 'Please enter a valid number';
    } else if (count < 5) {
      errorMessage = 'Minimum 5 problems required';
    } else if (count > 50) {
      errorMessage = 'Maximum 50 problems allowed';
    }
    
    setErrors(prev => ({
      ...prev,
      problemCount: errorMessage
    }));
  };

  const isFormValid = () => {
    return !errors.digits && !errors.operations && !errors.problemCount && 
           config.operations.length > 0;
  };

  // Generate random number based on digit count
  const generateRandomNumber = (digits) => {
    const min = digits === 1 ? 1 : Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate addition problem
  const generateAddition = (digits) => {
    const operand1 = generateRandomNumber(digits);
    const operand2 = generateRandomNumber(digits);
    return {
      id: Math.random().toString(36).substring(2, 11),
      operand1,
      operand2,
      operator: '+',
      answer: operand1 + operand2,
      displayFormat: `${operand1} + ${operand2} = ___`
    };
  };

  // Generate subtraction problem (ensure positive result)
  const generateSubtraction = (digits) => {
    let operand1 = generateRandomNumber(digits);
    let operand2 = generateRandomNumber(digits);
    
    // Ensure operand1 >= operand2 for positive result
    if (operand1 < operand2) {
      [operand1, operand2] = [operand2, operand1];
    }
    
    return {
      id: Math.random().toString(36).substring(2, 11),
      operand1,
      operand2,
      operator: '-',
      answer: operand1 - operand2,
      displayFormat: `${operand1} - ${operand2} = ___`
    };
  };

  // Generate multiplication problem
  const generateMultiplication = (digits) => {
    const operand1 = generateRandomNumber(digits);
    const operand2 = generateRandomNumber(digits);
    return {
      id: Math.random().toString(36).substring(2, 11),
      operand1,
      operand2,
      operator: '*',
      answer: operand1 * operand2,
      displayFormat: `${operand1} × ${operand2} = ___`
    };
  };

  // Generate division problem (ensure whole number result and digit constraint)
  const generateDivision = (digits) => {
    const maxAllowed = Math.pow(10, digits) - 1;
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      // Generate divisor and quotient within digit constraint
      const divisor = generateRandomNumber(digits);
      const quotient = generateRandomNumber(digits);
      const dividend = divisor * quotient;
      
      // Check if dividend is within digit constraint
      if (dividend <= maxAllowed) {
        return {
          id: Math.random().toString(36).substring(2, 11),
          operand1: dividend,
          operand2: divisor,
          operator: '/',
          answer: quotient,
          displayFormat: `${dividend} ÷ ${divisor} = ___`
        };
      }
      attempts++;
    }
    
    // Fallback: use smaller numbers to guarantee success
    const smallDivisor = Math.floor(Math.random() * 9) + 2; // 2-10
    const smallQuotient = Math.floor(Math.random() * Math.min(9, Math.floor(maxAllowed / smallDivisor))) + 1;
    const dividend = smallDivisor * smallQuotient;
    
    return {
      id: Math.random().toString(36).substring(2, 11),
      operand1: dividend,
      operand2: smallDivisor,
      operator: '/',
      answer: smallQuotient,
      displayFormat: `${dividend} ÷ ${smallDivisor} = ___`
    };
  };

  // Generate single problem based on operation
  const generateProblem = (operation, digits) => {
    switch (operation) {
      case '+':
        return generateAddition(digits);
      case '-':
        return generateSubtraction(digits);
      case '*':
        return generateMultiplication(digits);
      case '/':
        return generateDivision(digits);
      default:
        return generateAddition(digits);
    }
  };

  // Generate all problems
  const generateProblems = async () => {
    if (!isFormValid()) return;

    setIsGenerating(true);
    setShowSuccess(false);
    setErrors(prev => ({ ...prev, generation: null }));

    try {
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      const newProblems = [];
      const { digits, operations, problemCount } = config;

      for (let i = 0; i < problemCount; i++) {
        // Randomly select an operation from the selected operations
        const randomOperation = operations[Math.floor(Math.random() * operations.length)];
        const problem = generateProblem(randomOperation, digits);
        newProblems.push(problem);
      }

      setProblems(newProblems);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error generating problems:', error);
      setErrors(prev => ({
        ...prev,
        generation: 'Failed to generate problems. Please try again.'
      }));
    } finally {
      setIsGenerating(false);
    }
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
          margin: 15mm !important;
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
          margin: 15mm !important;
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

  return (
    <div className="math-generator">
      <h1>Math Problem Generator</h1>
      
      <div className="config-section">
        <h2>Configuration</h2>
        
        {/* Digits Selection */}
        <div className="form-group">
          <label className="form-label">
            Number of Digits (1-4):
          </label>
          <select 
            value={config.digits} 
            onChange={handleDigitsChange}
            className={`form-select ${validationTouched.digits ? (errors.digits ? 'error' : 'valid') : ''}`}
            disabled={isGenerating}
          >
            <option value={1}>1 digit</option>
            <option value={2}>2 digits</option>
            <option value={3}>3 digits</option>
            <option value={4}>4 digits</option>
          </select>
          {validationTouched.digits && errors.digits && <div className="error-message">{errors.digits}</div>}
          {validationTouched.digits && !errors.digits && <div className="success-message">✓ Valid selection</div>}
        </div>

        {/* Operations Selection */}
        <div className="form-group">
          <label className="form-label">
            Operations:
          </label>
          <div className={`operations-group ${validationTouched.operations ? (errors.operations ? 'error' : 'valid') : ''}`}>
            {['+', '-', '*', '/'].map(operation => (
              <label key={operation} className="operation-checkbox">
                <input
                  type="checkbox"
                  checked={config.operations.includes(operation)}
                  onChange={() => handleOperationChange(operation)}
                  disabled={isGenerating}
                />
                <span className="operation-label">{operation}</span>
                <span style={{ marginLeft: '4px' }}>
                  {operation === '+' && 'Addition'}
                  {operation === '-' && 'Subtraction'}
                  {operation === '*' && 'Multiplication'}
                  {operation === '/' && 'Division'}
                </span>
              </label>
            ))}
          </div>
          {validationTouched.operations && errors.operations && <div className="error-message">{errors.operations}</div>}
          {validationTouched.operations && !errors.operations && config.operations.length > 0 && (
            <div className="success-message">✓ {config.operations.length} operation{config.operations.length > 1 ? 's' : ''} selected</div>
          )}
        </div>

        {/* Problem Count */}
        <div className="form-group">
          <label className="form-label">
            Number of Problems (5-50):
          </label>
          <input
            type="number"
            min="5"
            max="50"
            value={config.problemCount}
            onChange={handleProblemCountChange}
            className={`form-input ${validationTouched.problemCount ? (errors.problemCount ? 'error' : 'valid') : ''}`}
            disabled={isGenerating}
            placeholder="Enter number of problems"
          />
          {validationTouched.problemCount && errors.problemCount && <div className="error-message">{errors.problemCount}</div>}
          {validationTouched.problemCount && !errors.problemCount && (
            <div className="success-message">✓ {config.problemCount} problems will be generated</div>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={generateProblems}
          disabled={!isFormValid() || isGenerating}
          className="generate-button"
        >
          {isGenerating ? (
            <>
              <span className="loading-spinner"></span>
              Generating Problems...
            </>
          ) : (
            'Generate Problems'
          )}
        </button>

        {/* Success Message */}
        {showSuccess && (
          <div className="success-banner">
            ✅ Successfully generated {problems.length} math problems!
          </div>
        )}

        {/* Generation Error */}
        {errors.generation && (
          <div className="error-banner">
            ❌ {errors.generation}
          </div>
        )}
      </div>

      {/* Problems Display Area */}
      <div id="problems-display">
        {problems.length > 0 ? (
          <div>
            <div className="no-print action-buttons">
              <button
                onClick={handlePrint}
                className="print-button"
                title="Print worksheet"
              >
                🖨️ Print Worksheet
              </button>
              <button
                onClick={handlePrintPreview}
                className="print-preview-button"
                title="Print preview"
              >
                👁️ Print Preview
              </button>
              <button
                onClick={() => setProblems([])}
                className="clear-button"
                title="Clear all problems"
              >
                🗑️ Clear Problems
              </button>
            </div>

            <PrintLayout 
              type="math-worksheet"
            >
              <div className="worksheet">
                <div className="worksheet-header">
                  <h1 className="worksheet-title">
                    Math Practice Worksheet
                  </h1>
                  <p className="worksheet-info">
                    Name: _________________ Date: _________________
                  </p>
                  <p className="worksheet-instructions">
                    Instructions: Solve each problem and write your answer in the blank space.
                  </p>
                </div>

                <div className={`problems-grid ${problems.length <= 25 ? 'single-column' : 'two-columns'}`}>
                  {problems.map((problem, index) => (
                    <div key={problem.id} className="problem-item">
                      <span className="problem-number">
                        {index + 1}.
                      </span>
                      <span className="problem-text">
                        {problem.displayFormat}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="worksheet-footer">
                  <p>Total Problems: {problems.length} | Generated on {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </PrintLayout>
          </div>
        ) : (
          <div className="empty-state">
            Configure the settings above and click "Generate Problems" to create your math worksheet.
          </div>
        )}
      </div>
    </div>
  );
}

export default MathGenerator;