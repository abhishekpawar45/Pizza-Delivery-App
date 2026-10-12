import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-14 p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Forgot Password</h2>
      <p className="text-xs text-center text-slate-500 mb-6">
        Enter your registered email address to receive a password reset link.
      </p>

      {msg && <p className="mb-4 text-sm text-center text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">{msg}</p>}
      {error && <p className="mb-4 text-sm text-center text-rose-600 bg-rose-50 p-2.5 rounded-lg">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-600">Email Address</label>
          <input
            type="email"
            required
            className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition"
        >
          {loading ? 'Sending Link...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-500">
        Remember your password? <Link to="/login" className="text-rose-600 font-bold hover:underline">Log in</Link>
      </p>
    </div>
  );
}