import React, { useEffect, useState } from 'react';
import API from '../api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    API.get('/my-orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Error fetching orders:', err));
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Order Received':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'In Kitchen':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Sent to Delivery':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-black mb-6 text-slate-800">My Pizza Orders</h1>
      {orders.length === 0 ? (
        <p className="text-slate-500 text-sm">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="p-5 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs text-slate-400 font-mono">ID: {o._id}</span>
                  <p className="font-bold text-slate-800 mt-1">
                    {o.items?.base} + {o.items?.sauce} + {o.items?.cheese}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Veggies: {o.items?.veggies?.join(', ') || 'None'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(o.orderStatus)}`}>
                  {o.orderStatus}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t">
                <span>Date: {new Date(o.createdAt).toLocaleString()}</span>
                <span className="text-base font-black text-rose-600">₹{o.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}