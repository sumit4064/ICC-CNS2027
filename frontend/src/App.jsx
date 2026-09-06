import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Speakers } from './pages/Speakers';
import { Tracks } from './pages/Tracks';
import { Dates } from './pages/Dates';
import { Submission } from './pages/Submission';
import { Registration } from './pages/Registration';
import { Committee } from './pages/Committee';
import { Venue } from './pages/Venue';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';

// Scroll to top helper
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/speakers" element={<Speakers />} />
                <Route path="/tracks" element={<Tracks />} />
                <Route path="/dates" element={<Dates />} />
                <Route path="/submission" element={<Submission />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/committee" element={<Committee />} />
                <Route path="/venue" element={<Venue />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/:tab" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
