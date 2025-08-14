import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <h1 className="nav-title">교육 도구</h1>
        
        {/* Mobile menu button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <Link 
              to="/math" 
              className={location.pathname === '/math' ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              계산 문제 생성기
            </Link>
          </li>
          <li>
            <Link 
              to="/maze" 
              className={location.pathname === '/maze' ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              미로 생성기
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;