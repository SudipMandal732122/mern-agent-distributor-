import React, { useState } from 'react';
import client from '../api';

export default function UploadLists({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  const submit = async e => {
    e.preventDefault();
    if (!file) return setMsg('Select a file');

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await client.post('/upload', form, { 
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg(res.data.message);
      onUploaded?.();
      setFile(null); // Clear file after upload
    } catch (err) {
      setMsg(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="card p-4 shadow-sm mb-3">
      <h4 className="mb-3">Upload Lists</h4>
      <form onSubmit={submit}>
        <input
          type="file"
          className="form-control mb-2"
          accept=".csv,.xlsx,.xls"
          onChange={e => setFile(e.target.files[0])}
        />
        <button type="submit" className="btn btn-primary w-100">
          Upload & Distribute
        </button>
      </form>
      {msg && <p className={`mt-2 ${msg.includes('failed') ? 'text-danger' : 'text-success'}`}>{msg}</p>}
    </div>
  );
}
