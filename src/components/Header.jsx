import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Database } from 'lucide-react';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            <Database size={32} />
            <span className="logo-text">Data Tools</span>
          </Link>

          <div className="nav-links">
            {!isHome && (
              <Link to="/" className="nav-link">
                <Home size={20} />
                <span>Home</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
