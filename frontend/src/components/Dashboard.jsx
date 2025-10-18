import React, { useEffect, useState } from 'react';
import client from '../api';
import AddAgent from './AddAgent';
import UploadLists from './UploadLists';

export default function Dashboard({onLogout}) {
  const [agents, setAgents] = useState([]);
  const [lists, setLists] = useState([]);

  const fetchAgents = async () => {
    const res = await client.get('/agents');
    setAgents(res.data);
  };

  const fetchLists = async () => {
    const res = await client.get('/upload/assigned');
    setLists(res.data);
  };

  useEffect(() => {
    fetchAgents();
    fetchLists();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    onLogout();
    window.location = '/login';
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Distributor Dashboard</h1>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>

      <div className="row g-4">
        {/* Agents Card */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm h-100">
            <h3 className="mb-3">Agents ({agents.length})</h3>
            <ul className="list-group mb-3">
              {agents.map(a => (
                <li key={a._id} className="list-group-item d-flex justify-content-between align-items-center">
                  {a.name} — {a.mobile} — {a.email}
                </li>
              ))}
            </ul>
            <AddAgent onCreated={fetchAgents} />
          </div>
        </div>

        {/* Upload Lists Card */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm h-100">
            <h3 className="mb-3">Upload Lists</h3>
            <UploadLists onUploaded={fetchLists} />
          </div>
        </div>

        {/* Assigned Lists Card */}
        <div className="col-12">
          <div className="card p-4 shadow-sm">
            <h3 className="mb-3">Assigned Lists</h3>
            {lists.length === 0 && <p className="text-muted">No assigned lists yet</p>}
            {lists.map(l => (
              <div key={l._id} className="mb-3 border rounded p-2 bg-light">
                <strong>{l.agent?.name} ({l.items.length})</strong>
                <ul className="list-group list-group-flush mt-2">
                  {l.items.slice(0, 10).map((it, i) => (
                    <li key={i} className="list-group-item">
                      {it.firstName} — {it.phone} — {it.notes}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
