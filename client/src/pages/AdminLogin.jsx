import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import API from '../api';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/admin/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied: Invalid Admin Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800">
      <div className="flex justify-center mb-3">
        <div className="p-3 bg-rose-600 rounded-full text-white">
          <ShieldCheck className="w-8 h-8" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center mb-1">Admin Portal</h2>
      <p className="text-xs text-center text-slate-400 mb-6">Restricted management access only</p>
      {error && <p className="mb-4 text-sm text-center text-rose-400 bg-rose-950/60 p-2.5 rounded-lg border border-rose-800">{error}</p>}
      <form onSubmit={handleAdminLogin} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-300">Admin Email</label>
          <input
            type="email"
            required
            className="w-full mt-1 p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-rose-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-300">Password</label>
          <input
            type="password"
            required
            className="w-full mt-1 p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-rose-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 font-bold rounded-lg transition"
        >
          {loading ? 'Authenticating...' : 'Enter Admin Console'}
        </button>
      </form>
    </div>
  );
}