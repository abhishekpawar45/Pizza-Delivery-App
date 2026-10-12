import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying your email...');

  useEffect(() => {
    API.get(`/auth/verify-email/${token}`)
      .then(res => setStatus(res.data.message))
      .catch(err => setStatus(err.response?.data?.message || 'Verification failed.'));
  }, [token]);

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow text-center">
      <h2 className="text-lg font-bold mb-3">Email Verification</h2>
      <p className="text-sm text-slate-600 mb-5">{status}</p>
      <Link to="/login" className="bg-rose-600 text-white px-4 py-2 rounded-lg font-medium">Proceed to Login</Link>
    </div>
  );
}