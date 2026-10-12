import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api';

export default function OrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 1. आधी location.state मधून डेटा घे, नसेल तर localStorage मधून वाच
  const savedItems = localStorage.getItem('pizza_order_items')
    ? JSON.parse(localStorage.getItem('pizza_order_items'))
    : null;
  const savedTotal = localStorage.getItem('pizza_order_total')
    ? Number(localStorage.getItem('pizza_order_total'))
    : 0;

  const items = location.state?.items || savedItems || {
    base: '',
    sauce: '',
    cheese: '',
    veggies: []
  };

  const totalAmount = location.state?.totalAmount || savedTotal || 0;

  // जर पिझ्झा कॉन्फिगर केलेला नसेल
  if (!items.base) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl shadow border border-slate-200 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">No Pizza Configured</h2>
        <p className="text-slate-500 mb-6 text-sm">Please build your custom pizza before proceeding to payment.</p>
        <button
          onClick={() => navigate('/build')}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-lg transition"
        >
          Go to Pizza Builder
        </button>
      </div>
    );
  }

  // 2. पेमेंट आणि ऑर्डर प्लेस हँडलर
  const handlePayment = async () => {
    try {
      setLoading(true);

      // १. पेमेंट ऑर्डर तयार करणे (दोन्ही राऊट्सचा सपोर्ट)
      let orderData;
      try {
        const res = await API.post('/create-payment-order', { amount: totalAmount });
        orderData = res.data;
      } catch (e) {
        const res = await API.post('/create-order', { amount: totalAmount });
        orderData = res.data;
      }

      // २. टेस्ट मोडमध्ये थेट ऑर्डर व्हेरिफाय आणि प्लेस करणे
      await API.post('/verify-order', {
        razorpay_order_id: orderData.id || `order_mock_${Date.now()}`,
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_signature: 'mock_signature',
        items,
        totalAmount
      });

      // जुनी स्टेट क्लिअर करणे
      localStorage.removeItem('pizza_order_items');
      localStorage.removeItem('pizza_order_total');

      alert('Order Placed Successfully!');
      navigate('/my-orders');
    } catch (error) {
      console.error('Order Placement Error:', error);
      const errMsg = error.response?.data?.message || error.message || 'Payment initiation failed';
      alert('Order placement failed: ' + errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-rose-600 px-6 py-4 text-white">
          <h2 className="text-xl font-black">Order Summary</h2>
          <p className="text-xs text-rose-100">Review your custom pizza configuration</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Selected Items</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-slate-600">Pizza Base:</span>
                <span className="font-bold text-slate-800">{items.base}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-600">Sauce:</span>
                <span className="font-bold text-slate-800">{items.sauce}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-600">Cheese:</span>
                <span className="font-bold text-slate-800">{items.cheese}</span>
              </li>
              <li className="flex justify-between items-start">
                <span className="text-slate-600">Veggies:</span>
                <span className="font-bold text-slate-800 text-right">
                  {items.veggies && items.veggies.length > 0 ? items.veggies.join(', ') : 'None'}
                </span>
              </li>
            </ul>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-base font-bold text-slate-800">Total Payable</span>
            <span className="text-2xl font-black text-rose-600">₹{totalAmount}</span>
          </div>

          <div className="pt-6 flex gap-3">
            <button
              onClick={() => navigate('/build')}
              className="w-1/3 py-3 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition text-sm"
            >
              Modify
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-2/3 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl shadow transition text-sm"
            >
              {loading ? 'Processing...' : 'Pay with Razorpay (Test Mode)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}