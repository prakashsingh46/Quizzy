import { useState } from 'react';
import './Navbar.css';

function Navbar({ currentScreen, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (section) => {
    setIsMenuOpen(false);
    onNavigate(section);
  };

  const isActive = (section) => {
    if (section === 'home') {
      return currentScreen === 'home' || currentScreen === 'loading' || 
             currentScreen === 'quiz' || currentScreen === 'results';
    }
    return currentScreen === section;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-icon">🎯</span>
          <span className="brand-name">Quizzy</span>
        </div>

        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <a 
              href="#home" 
              className={`nav-link ${isActive('home') ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
            >
              <span className="nav-icon">🏠</span>
              Home
            </a>
          </li>
          <li>
            <a 
              href="#trending" 
              className={`nav-link ${isActive('trending') ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('trending');
              }}
            >
              <span className="nav-icon">🔥</span>
              Trending
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              className={`nav-link ${isActive('about') ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('about');
              }}
            >
              <span className="nav-icon">ℹ️</span>
              About
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              className={`nav-link ${isActive('contact') ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('contact');
              }}
            >
              <span className="nav-icon">📧</span>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
