import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders');
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white">My Pizza Orders</h1>
            <p className="text-sm text-slate-400">Live Kitchen & Delivery Status</p>
          </div>
          <button
            onClick={() => navigate('/builder')}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold transition"
          >
            + Order Another Pizza
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="text-4xl">🍕</div>
            <h3 className="text-lg font-bold text-white">No Orders Placed Yet</h3>
            <p className="text-sm text-slate-400">You haven't placed any custom pizza orders yet.</p>
            <button
              onClick={() => navigate('/builder')}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold transition"
            >
              Build Your Pizza Now ➔
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono text-slate-500">Order #{ord._id.slice(-6)}</span>
                    <div className="text-sm text-slate-400 mt-0.5">
                      {new Date(ord.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {ord.status || 'Order Received'}
                  </span>
                </div>

                <div className="space-y-2">
                  {ord.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-white font-medium">
                        {item.name} ({item.base}, {item.sauce}, {item.cheese})
                      </span>
                      <span className="text-emerald-400 font-bold">₹{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-sm">
                  <span className="text-slate-400">Total Paid:</span>
                  <span className="text-lg font-black text-emerald-400">₹{ord.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}