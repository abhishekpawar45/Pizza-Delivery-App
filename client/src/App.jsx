import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import PizzaBuilder from './pages/PizzaBuilder';
import OrderSummary from './pages/OrderSummary';
import MyOrders from './pages/MyOrders';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import AdminInventory from './pages/AdminInventory';

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = role === 'admin' || user.role === 'admin';
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

const UserRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <Navbar />
        <Routes>
          {/* User Protected Routes */}
          <Route path="/" element={<UserRoute><PizzaBuilder /></UserRoute>} />
          <Route path="/build" element={<UserRoute><PizzaBuilder /></UserRoute>} />
          <Route path="/builder" element={<UserRoute><PizzaBuilder /></UserRoute>} />
          <Route path="/order-summary" element={<UserRoute><OrderSummary /></UserRoute>} />
          <Route path="/my-orders" element={<UserRoute><MyOrders /></UserRoute>} />

          {/* Public & Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/inventory" element={<AdminRoute><AdminInventory /></AdminRoute>} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}