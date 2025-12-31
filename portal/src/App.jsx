import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdminRoute from './components/SuperAdminRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Vendors from './pages/Vendors';
import Modules from './pages/Modules';
import Users from './pages/Users';
import AdminManagement from './pages/AdminManagement';
import Settings from './pages/Settings';

// Create Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#8b9dee',
      dark: '#5568d3',
    },
    secondary: {
      main: '#764ba2',
      light: '#8b5db8',
      dark: '#603d87',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 800,
    },
    h6: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Route - Login */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - Require Authentication */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={
                      <SuperAdminRoute>
                        <Dashboard />
                      </SuperAdminRoute>
                    } />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/vendors" element={<Vendors />} />
                    <Route path="/modules" element={
                      <SuperAdminRoute>
                        <Modules />
                      </SuperAdminRoute>
                    } />
                    <Route path="/users" element={
                      <SuperAdminRoute>
                        <Users />
                      </SuperAdminRoute>
                    } />
                    <Route path="/admins" element={
                      <SuperAdminRoute>
                        <AdminManagement />
                      </SuperAdminRoute>
                    } />
                    <Route path="/settings" element={<Settings />} />
                    {/* Redirect unknown routes based on role */}
                    <Route path="*" element={<Navigate to="/orders" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
