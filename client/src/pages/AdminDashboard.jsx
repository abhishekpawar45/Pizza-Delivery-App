import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [notification, setNotification] = useState('');

  // उपलब्ध असणारे स्टेटसचे पर्याय
  const statusOptions = [
    'Order Received',
    'In Kitchen',
    'Sent to Delivery',
    'Delivered',
  ];

  // सर्व ऑर्डर्स बॅकएंडवरून आणणे
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      showNotification('ऑर्डर्स लोड करताना अडचण आली.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // स्टेटस अपडेट करण्याचे मुख्य फंक्शन (PATCH + PUT Fallback सह)
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // बॅकएंडला स्टेटस बदलण्याची विनंती पाठवणे
      const res = await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers }
      );

      if (res.data) {
        // स्क्रीनवरील स्टेटस लगेच अपडेट करणे
        setOrders((prev) =>
          prev.map((ord) =>
            ord._id === orderId ? { ...ord, status: newStatus } : ord
          )
        );
        showNotification(`Order #${orderId.slice(-6)} चा स्टेटस बदलून "${newStatus}" झाला!`);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      showNotification('स्टेटस अपडेट अयशस्वी झाला. कृपया सर्व्हर तपासा.');
    } finally {
      setUpdatingId(null);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              Kitchen & Dispatch Control
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight mt-2">
              Admin Orders Dashboard
            </h1>
            <p className="text-sm text-slate-400">
              Manage incoming artisanal pizza orders and live delivery pipeline
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto"
          >
            <span>🔄</span> Refresh Orders
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium text-center transition">
            {notification}
          </div>
        )}

        {/* Orders Table / Cards */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 space-y-3">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm">ऑर्डर्स लोड होत आहेत...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="text-4xl">📦</div>
            <h3 className="text-lg font-bold text-white">सध्या कोणतीही नवीन ऑर्डर नाही</h3>
            <p className="text-sm text-slate-500">ग्राहकांनी ऑर्डर दिल्यावर त्या इथे दिसतील.</p>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Pizza Items</th>
                    <th className="p-4">Delivery Info</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4 text-center">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-800/30 transition">
                      
                      {/* ID and Date */}
                      <td className="p-4 align-top">
                        <div className="font-mono text-xs font-bold text-slate-200">
                          #{ord._id.slice(-6)}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="p-4 align-top max-w-xs">
                        {ord.items && ord.items.length > 0 ? (
                          ord.items.map((item, idx) => (
                            <div key={idx} className="space-y-0.5 mb-2">
                              <div className="font-semibold text-slate-200">{item.name}</div>
                              <div className="text-xs text-slate-400">
                                {item.base} • {item.sauce} • {item.cheese}
                              </div>
                              {item.veggies && item.veggies.length > 0 && (
                                <div className="text-[11px] text-red-400">
                                  +{item.veggies.join(', ')}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-500 italic">No details</span>
                        )}
                      </td>

                      {/* Delivery Info */}
                      <td className="p-4 align-top text-xs max-w-xs">
                        <div className="text-slate-200 font-medium">{ord.deliveryAddress || 'Not specified'}</div>
                        <div className="text-slate-400 mt-1">📞 {ord.phone || 'No phone'}</div>
                      </td>

                      {/* Amount */}
                      <td className="p-4 align-top">
                        <span className="text-emerald-400 font-bold text-base">
                          ₹{ord.totalAmount}
                        </span>
                      </td>

                      {/* Current Status Badge */}
                      <td className="p-4 align-top">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : ord.status === 'Sent to Delivery'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : ord.status === 'In Kitchen'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          }`}
                        >
                          {ord.status || 'Order Received'}
                        </span>
                      </td>

                      {/* Status Dropdown Action */}
                      <td className="p-4 align-top text-center">
                        <select
                          disabled={updatingId === ord._id}
                          value={ord.status || 'Order Received'}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-red-500 cursor-pointer disabled:opacity-50 transition"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
                              {opt}
                            </option>
                          ))}
                        </select>
                        {updatingId === ord._id && (
                          <div className="text-[10px] text-slate-500 mt-1">Updating...</div>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
