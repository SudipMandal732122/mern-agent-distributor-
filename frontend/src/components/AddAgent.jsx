import React, { useState } from 'react';
import client from '../api';

export default function AddAgent({ onCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await client.post('/agents', { name, email, mobile, password });
      setMsg('Agent created');
      setName(''); 
      setEmail(''); 
      setMobile(''); 
      setPassword('');
      onCreated?.();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="card p-4 shadow-sm mb-3">
      <h4 className="mb-3">Add Agent</h4>
      <form onSubmit={submit}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="+91xxxxxxxxxx"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          required
        />
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-100">Create</button>
      </form>
      {msg && <p className="mt-2 text-success">{msg}</p>}
    </div>
  );
}
