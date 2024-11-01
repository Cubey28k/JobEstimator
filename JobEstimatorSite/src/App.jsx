import React, { useState, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import theme from './components/Theme';
import Navbar from './components/Navbar';
import EstimatePage from './pages/EstimatePage';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import About from './pages/About';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login and save the attempted path
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return children;
};

// Public Route Component (only redirects specific routes when logged in)
const PublicRoute = ({ children, requiresGuest = false }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const from = location.state?.from || '/estimate';

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Only redirect if the route requires guest access (like login page)
  if (user && requiresGuest) {
    return <Navigate to={from} replace />;
  }

  return children;
};

function AppRoutes() {
  const [estimate, setEstimate] = useState(null);
  const { user, loading } = useContext(AuthContext);

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Container>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <PublicRoute requiresGuest={true}>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgotpassword" 
            element={
              <PublicRoute requiresGuest={true}>
                <ForgotPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/about" 
            element={
              <PublicRoute>
                <About />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route
            path="/estimate"
            element={
              <PublicRoute>
                <EstimatePage estimate={estimate} setEstimate={setEstimate} />
              </PublicRoute>
            }
          />

          {/* Redirect all other routes */}
          <Route path="*" element={<Navigate to={user ? "/estimate" : "/"} replace />} />
        </Routes>
      </Container>
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;