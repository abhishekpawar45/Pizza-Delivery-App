import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OrderSummary() {
  const navigate = useNavigate();
  const [pizza, setPizza] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem('customPizza') ||
        localStorage.getItem('pizza') ||
        localStorage.getItem('pizzaConfig');

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.base || parsed.totalPrice)) {
          setPizza(parsed);
          return;
        }
      }

      // डिफॉल्ट बॅकअप पिझ्झा
      const defaultPizza = {
        base: 'Thin Crust',
        sauce: 'Classic Marinara',
        cheese: 'Fresh Mozzarella',
        veggies: ['Bell Peppers', 'Jalapeños'],
        totalPrice: 260,
      };
      setPizza(defaultPizza);
      localStorage.setItem('customPizza', JSON.stringify(defaultPizza));
    } catch (err) {
      console.error('Error loading pizza configuration:', err);
    }
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!deliveryAddress.trim() || !phone.trim()) {
      setErrorMsg('कृपया डिलिव्हरी पत्ता आणि मोबाईल नंबर भरा.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const token = localStorage.getItem('token');
    const orderPayload = {
      items: [
        {
          name: 'Custom Artisan Pizza',
          base: pizza.base || 'Thin Crust',
          sauce: pizza.sauce || 'Classic Marinara',
          cheese: pizza.cheese || 'Fresh Mozzarella',
          veggies: Array.isArray(pizza.veggies)
            ? pizza.veggies.map((v) => (typeof v === 'string' ? v : v.name))
            : [],
          price: pizza.totalPrice || 250,
          quantity: 1,
        },
      ],
      totalAmount: (pizza.totalPrice || 250) + Math.round((pizza.totalPrice || 250) * 0.05) + 30,
      deliveryAddress,
      phone,
      paymentMethod: 'Online (Test Mode)',
    };

    try {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await axios.post('http://localhost:5000/api/orders', orderPayload, { headers });

      if (res.status === 201 || res.status === 200) {
        localStorage.removeItem('customPizza');
        localStorage.removeItem('pizza');
        localStorage.removeItem('pizzaConfig');
        navigate('/my-orders');
      }
    } catch (err) {
      console.error('Order creation failed:', err);
      setErrorMsg('ऑर्डर सेव्ह करताना अडचण आली. कृपया बॅकएंड सर्व्हर चालू असल्याची खात्री करा.');
    } finally {
      setLoading(false);
    }
  };

  if (!pizza) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-6 text-slate-200">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-400">Loading order configuration...</p>
        </div>
      </div>
    );
  }

  const basePrice = pizza.totalPrice || 250;
  const gst = Math.round(basePrice * 0.05);
  const deliveryFee = 30;
  const finalPayable = basePrice + gst + deliveryFee;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Review & Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Order Summary
          </h1>
          <p className="text-sm text-slate-400">
            Confirm your artisanal pizza details and delivery address
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Configuration Details & Address Form */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Your Custom Pizza</h2>
                <p className="text-xs text-slate-400 mt-0.5">Freshly prepared to order</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/builder')}
                className="text-xs font-bold text-red-400 hover:text-red-300 transition underline underline-offset-4"
              >
                Edit Pizza
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <span className="text-slate-400">Crust:</span>
                <span className="font-semibold text-slate-200">{pizza.base || 'Standard Crust'}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <span className="text-slate-400">Sauce:</span>
                <span className="font-semibold text-slate-200">{pizza.sauce || 'Classic Marinara'}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <span className="text-slate-400">Cheese:</span>
                <span className="font-semibold text-slate-200">{pizza.cheese || 'Mozzarella'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Veggies:</span>
                  <span className="text-xs text-slate-500 font-mono">
                    {Array.isArray(pizza.veggies) ? pizza.veggies.length : 0} Selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {Array.isArray(pizza.veggies) && pizza.veggies.length > 0 ? (
                    pizza.veggies.map((veg, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-red-500/10 text-red-300 border border-red-500/20 px-2.5 py-1 rounded-lg font-medium"
                      >
                        {typeof veg === 'string' ? veg : veg.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No extra toppings added</span>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <form onSubmit={handlePlaceOrder} id="order-form" className="space-y-4 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Delivery Details
              </h3>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Delivery Address *</label>
                <textarea
                  required
                  rows="2"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Flat/House No, Street, Landmark..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500 transition"
                />
              </div>
            </form>
          </div>

          {/* Right: Pricing Card */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Bill Breakdown
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Pizza Subtotal</span>
                <span>₹{basePrice}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>GST (5%)</span>
                <span>₹{gst}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Delivery & Packaging</span>
                <span>₹{deliveryFee}</span>
              </div>

              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-base font-bold text-white">
                <span>Total Payable</span>
                <span className="text-2xl font-black text-emerald-400">₹{finalPayable}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                form="order-form"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white font-bold text-sm transition shadow-lg shadow-red-600/30 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Order...</span>
                  </>
                ) : (
                  <span>Place Order & Pay Now (₹{finalPayable}) ➔</span>
                )}
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-500">
              🔒 Instant Kitchen Dispatch & Live Status Tracking
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}