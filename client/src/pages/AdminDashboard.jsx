import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  // टोकन आणि ऑथ हेडर मिळवणे
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders', getAuthHeaders());
      // रिस्पॉन्स नेहमी Array असल्याची खात्री करणे
      setOrders(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // ५ सेकंदांचे ऑटो-पोलिंग रिअल-टाईम अपडेट्ससाठी
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        getAuthHeaders()
      );
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Order Received':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'In Kitchen':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Sent to Delivery':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const filteredOrders =
    filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Admin Operations Panel</h1>
            <p className="text-xs text-slate-400 mt-1">Live Kitchen Pipeline & Order Management</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/inventory"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition flex items-center gap-2"
            >
              <span>📦</span> Manage Inventory
            </Link>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition shadow-sm"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Quick Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="text-3xl font-black text-white mt-2">{orders.length}</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="text-3xl font-black text-emerald-400 mt-2">₹{totalRevenue}</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kitchen Queue</span>
            <div className="text-3xl font-black text-amber-400 mt-2">
              {orders.filter((o) => o.status === 'In Kitchen').length}
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === st
                  ? 'bg-white text-black shadow-md'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/40 border-b border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Items / Recipe</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4">Update Pipeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400 font-semibold">
                      Loading incoming orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold">
                      No orders found in this category.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Order ID */}
                      <td className="p-4 font-mono text-slate-400">
                        #{order._id?.slice(-6) || 'N/A'}
                      </td>

                      {/* Customer Details */}
                      <td className="p-4">
                        <div className="font-bold text-white">
                          {order.user?.name || order.userName || 'Guest User'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {order.user?.email || order.userEmail || 'No email provided'}
                        </div>
                      </td>

                      {/* Items / Custom Pizza Config */}
                      <td className="p-4 max-w-xs">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div key={idx} className="mb-1 text-slate-300">
                              <span className="font-bold text-white">{item.name || 'Custom Pizza'}</span>
                              {(item.base || item.sauce || item.cheese) && (
                                <div className="text-[10px] text-slate-400">
                                  {item.base && `Base: ${item.base} | `}
                                  {item.sauce && `Sauce: ${item.sauce} | `}
                                  {item.cheese && `Cheese: ${item.cheese}`}
                                  {item.veggies?.length > 0 && ` | Veggies: ${item.veggies.join(', ')}`}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400">Standard Order</span>
                        )}
                      </td>

                      {/* Total Price */}
                      <td className="p-4 font-bold text-emerald-400 text-sm">
                        ₹{order.totalPrice || 0}
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Status Change Dropdown */}
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-red-500"
                        >
                          <option value="Order Received">Order Received</option>
                          <option value="In Kitchen">In Kitchen</option>
                          <option value="Sent to Delivery">Sent to Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;