import React, { useState } from 'react';

const PizzaBuilder = ({ onAddToCart }) => {
  const [step, setStep] = useState(1);
  const [selectedBase, setSelectedBase] = useState('Thin Crust');
  const [selectedSauce, setSelectedSauce] = useState('Classic Marinara');
  const [selectedCheese, setSelectedCheese] = useState('Mozzarella');
  const [selectedVeggies, setSelectedVeggies] = useState([]);

  const bases = [
    { id: '1', name: 'Thin Crust', price: 99, desc: 'Crispy & lightweight' },
    { id: '2', name: 'Cheese Burst', price: 149, desc: 'Filled with melted molten cheese' },
    { id: '3', name: 'Pan Pizza', price: 119, desc: 'Soft, thick & golden crust' },
    { id: '4', name: 'Wheat Thin', price: 109, desc: 'Healthy & fibrous dough' },
    { id: '5', name: 'Garlic Crust', price: 129, desc: 'Infused with roasted garlic butter' }
  ];

  const veggiesList = ['Bell Peppers', 'Black Olives', 'Jalapeños', 'Red Onions', 'Mushrooms', 'Sweet Corn'];

  const toggleVeggie = (veg) => {
    setSelectedVeggies((prev) =>
      prev.includes(veg) ? prev.filter((v) => v !== veg) : [...prev, veg]
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Tracker */}
        <div className="mb-10 text-center">
          <span className="text-xs uppercase font-extrabold tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Step {step} of 4
          </span>
          <h1 className="text-3xl font-black text-gray-900 mt-3 tracking-tight">
            Craft Your Signature Pizza
          </h1>
          <p className="text-sm text-gray-500 mt-1">Pick freshly sourced artisanal ingredients</p>
        </div>

        {/* Main Builder Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🌾</span> Choose Pizza Base
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {bases.map((base) => {
                  const isSelected = selectedBase === base.name;
                  return (
                    <div
                      key={base.id}
                      onClick={() => setSelectedBase(base.name)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 flex justify-between items-center ${
                        isSelected
                          ? 'border-red-600 bg-red-50/40 shadow-xs'
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{base.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{base.desc}</p>
                      </div>
                      <span className="text-sm font-extrabold text-red-600">+₹{base.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🥦</span> Select Vegetables (Multiple)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {veggiesList.map((veg) => {
                  const isSelected = selectedVeggies.includes(veg);
                  return (
                    <button
                      key={veg}
                      type="button"
                      onClick={() => toggleVeggie(veg)}
                      className={`p-3.5 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between ${
                        isSelected
                          ? 'border-red-600 bg-red-600 text-white shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                      }`}
                    >
                      <span>{veg}</span>
                      <span>{isSelected ? '✓' : '+'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            <button
              disabled={step === 1}
              onClick={() => setStep((s) => s - 1)}
              className="text-xs font-bold text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Back
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs transition-all"
              >
                Next Step →
              </button>
            ) : (
              <button
                onClick={() => alert('Pizza added to cart!')}
                className="bg-gradient-to-r from-red-600 to-amber-600 hover:opacity-95 text-white text-xs font-bold px-7 py-3 rounded-xl shadow-md transition-all"
              >
                Add to Cart & Checkout ✨
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaBuilder;