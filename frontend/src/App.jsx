import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddAgent from './components/AddAgent';
import UploadLists from './components/UploadLists';
import client from './api'; // added to validate token

function App() {

  const [token, setToken] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    const verifyToken = async () => {
      const t = localStorage.getItem('token');
      if (!t) {
        if (mounted) setChecking(false);
        return;
      }
      try {

        await client.get('/agents');
        if (mounted) setToken(t);
      } catch (err) {
        localStorage.removeItem('token');
        if (mounted) setToken(null);
      } finally {
        if (mounted) setChecking(false);
      }
    };
    verifyToken();
    const handleStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => {
      mounted = false;
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // while verifying, render nothing 
  if (checking) return null;

  const isLoggedIn = !!token;

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => setToken(localStorage.getItem('token'))} />} />
      <Route path="/dashboard" element={isLoggedIn ? <Dashboard onLogout={() => { localStorage.removeItem('token'); setToken(null); }} /> : <Navigate to="/login" />} />
      <Route path="/add-agent" element={isLoggedIn ? <AddAgent /> : <Navigate to="/login" />} />
      <Route path="/upload-lists" element={isLoggedIn ? <UploadLists /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;