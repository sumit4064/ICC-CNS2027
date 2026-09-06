import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setMoreDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setMoreDropdownOpen(false);
    }, 200);
  };

  const handleToggleClick = (e) => {
    e.stopPropagation();
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setMoreDropdownOpen((prev) => !prev);
  };

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setMoreDropdownOpen(false);
  }, [location.pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Click outside to close "More" dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMoreDropdownOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Primary navigation links visible in the main navbar row
  const primaryNavLinks = [
    { name: 'About', path: '/about' },
    { name: 'Speakers', path: '/speakers' },
    { name: 'Tracks', path: '/tracks' },
    { name: 'Important Dates', path: '/dates' },
    { name: 'Submission', path: '/submission' },
    { name: 'Registration', path: '/registration' }
  ];

  // Secondary navigation links (shown in horizontal bar on >= 1500px, inside More ▼ dropdown on 1200px-1499px)
  const secondaryNavLinks = [
    { name: 'Committee', path: '/committee' },
    { name: 'Venue', path: '/venue' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  const isMoreActive = secondaryNavLinks.some((l) => location.pathname === l.path);

  return (
    <>
      <header className={`navbar-container ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-grid">
          {/* ========================================================
              ZONE 1 — BRAND
             ======================================================== */}
          <Link to="/" className="brand" aria-label="ICC-CNS 2027 Home">
            <div className="brand-logo-wrap">
              <img
                src="/logos/vignan_official_logo.svg"
                alt="Vignan University Logo"
                className="logo"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logos/vignan_logo_new.png';
                }}
              />
            </div>

            <div className="brand-divider" />

            <div className="brand-info">
              <div className="conference-name">
                ICC-<span className="conference-name-accent">CNS</span> 2027
              </div>
              <div className="university-name">
                VIGNAN UNIVERSITY, AP
              </div>
            </div>
          </Link>

          {/* ========================================================
              ZONE 2 — NAVIGATION
             ======================================================== */}
          <nav className="nav-links" aria-label="Main Navigation">
            {primaryNavLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={isActive ? 'active' : ''}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* "More ▼" Dropdown */}
            <div
              ref={dropdownRef}
              className="more-dropdown-wrap"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`more-dropdown-btn ${isMoreActive ? 'active' : ''} ${moreDropdownOpen ? 'open' : ''}`}
                onClick={handleToggleClick}
                aria-expanded={moreDropdownOpen}
                aria-haspopup="true"
              >
                <span>More</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: moreDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </button>

              {moreDropdownOpen && (
                <div
                  className="more-dropdown-panel"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {secondaryNavLinks.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={isActive ? 'active' : ''}
                        onClick={() => {
                          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                          setMoreDropdownOpen(false);
                        }}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* ========================================================
              ZONE 3 — ACTIONS
             ======================================================== */}
          <div className="nav-actions">
            {/* User Login / Admin Badge */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="admin-badge-button"
                    title="Admin Dashboard"
                  >
                    <ShieldCheck size={15} />
                    <span>Admin</span>
                  </Link>
                ) : (
                  <span className="badge badge-teal" style={{ padding: '5px 10px', fontSize: '13px' }}>
                    <User size={14} />
                    <span>{user.name.split(' ')[0]}</span>
                  </span>
                )}
                <button
                  onClick={logout}
                  className="logout-icon-button"
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-button">
                <User size={16} />
                <span>Login</span>
              </Link>
            )}

            {/* Primary CTA Register Button */}
            <Link to="/registration" className="register-button">
              <span>Register Now</span>
              <ArrowRight size={15} />
            </Link>

            {/* Mobile / Tablet Hamburger Toggle Button (< 1200px) */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          MOBILE / TABLET FULL-SCREEN SLIDE-OVER DRAWER (< 1200px)
         ======================================================== */}
      <div
        className={`mobile-overlay-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`mobile-drawer-view ${mobileOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
        <div className="mobile-drawer-top">
          <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
            <div className="brand-logo-wrap" style={{ height: '40px', padding: '2px 6px' }}>
              <img
                src="/logos/vignan_official_logo.svg"
                alt="Vignan University Logo"
                style={{ height: '32px', maxWidth: '100px', objectFit: 'contain' }}
              />
            </div>
            <div className="brand-info">
              <div className="conference-name" style={{ fontSize: '20px' }}>
                ICC-<span className="conference-name-accent">CNS</span> 2027
              </div>
              <div className="university-name" style={{ fontSize: '9px' }}>
                Vignan University, AP
              </div>
            </div>
          </Link>

          <button
            className="mobile-drawer-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close Navigation Menu"
          >
            <X size={20} />
          </button>
        </div>

        <ul className="mobile-drawer-nav-list">
          <li>
            <Link
              to="/"
              className={`mobile-drawer-item-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span>Home</span>
              <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
            </Link>
          </li>
          {allNavLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`mobile-drawer-item-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{item.name}</span>
                  <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
                </Link>
              </li>
            );
          })}
          {isAdmin && (
            <li>
              <Link
                to="/admin"
                className={`mobile-drawer-item-link ${location.pathname === '/admin' ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                style={{ color: '#FF6B35' }}
              >
                <span>Admin Dashboard</span>
                <ShieldCheck size={18} color="#FF6B35" />
              </Link>
            </li>
          )}
        </ul>

        <div className="mobile-drawer-bottom">
          {user ? (
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="btn-secondary-glass"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="btn-secondary-glass"
              onClick={() => setMobileOpen(false)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <User size={16} /> Login
            </Link>
          )}

          <Link
            to="/registration"
            className="register-button"
            onClick={() => setMobileOpen(false)}
            style={{ width: '100%', height: '48px', fontSize: '15px' }}
          >
            <span>Register Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </aside>
    </>
  );
};
