import React, { useState } from 'react';
import client from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({onLogin}) {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const nav = useNavigate();

  const handle = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await client.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      onLogin(); 
      nav('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100" style={{ backgroundColor: '#f5f0f4ff' }}>
      
      {/* App title outside login card */}
      <div className="mb-4 text-center">
        <h1 style={{ color: '#0f53a1ff', fontWeight: '700' }}>Agent Distributor</h1>
      </div>

      {/* Login card */}
      <div className="card p-5 shadow-lg" style={{ maxWidth: '400px', width: '100%', borderRadius: '12px', backgroundColor: '#ffffff' }}>
        {/* Admin Login inside the card */}
        <h2 className="text-center mb-4" style={{ color: '#333' }}>Admin Login</h2>

        <form onSubmit={handle}>
          <div className="mb-3">
            <input 
              type="email"
              className="form-control" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
            />
          </div>
          <div className="mb-3">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>
          <button className="btn btn-primary w-100 mb-2" type="submit">Login</button>
          {error && <div className="text-danger text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
}
