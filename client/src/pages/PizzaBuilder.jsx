import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INGREDIENTS = {
  bases: [
    { name: 'Thin Crust', price: 120 },
    { name: 'Cheese Burst', price: 180 },
    { name: 'Whole Wheat', price: 140 },
    { name: 'Gluten-Free', price: 160 },
  ],
  sauces: [
    { name: 'Classic Marinara', price: 40 },
    { name: 'Spicy Peri-Peri', price: 50 },
    { name: 'Creamy Garlic Alfredo', price: 60 },
    { name: 'Barbecue Smoke', price: 55 },
  ],
  cheeses: [
    { name: 'Fresh Mozzarella', price: 70 },
    { name: 'Sharp Cheddar', price: 80 },
    { name: 'Smoked Gouda', price: 95 },
    { name: 'Plant-Based Vegan Cheese', price: 90 },
  ],
  veggies: [
    { name: 'Bell Peppers', price: 30 },
    { name: 'Black Olives', price: 35 },
    { name: 'Jalapeños', price: 30 },
    { name: 'Grilled Mushrooms', price: 40 },
    { name: 'Red Onion', price: 25 },
    { name: 'Baby Corn', price: 30 },
  ],
};

export default function PizzaBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // States for selected items
  const [selectedBase, setSelectedBase] = useState(INGREDIENTS.bases[0]);
  const [selectedSauce, setSelectedSauce] = useState(INGREDIENTS.sauces[0]);
  const [selectedCheese, setSelectedCheese] = useState(INGREDIENTS.cheeses[0]);
  const [selectedVeggies, setSelectedVeggies] = useState([]);

  // Calculate total price live
  const basePrice = selectedBase?.price || 0;
  const saucePrice = selectedSauce?.price || 0;
  const cheesePrice = selectedCheese?.price || 0;
  const veggiesPrice = selectedVeggies.reduce((sum, v) => sum + v.price, 0);
  const totalPrice = basePrice + saucePrice + cheesePrice + veggiesPrice;

  const toggleVeggie = (veg) => {
    if (selectedVeggies.some((v) => v.name === veg.name)) {
      setSelectedVeggies(selectedVeggies.filter((v) => v.name !== veg.name));
    } else {
      setSelectedVeggies([...selectedVeggies, veg]);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      const pizzaConfig = {
        base: selectedBase.name,
        sauce: selectedSauce.name,
        cheese: selectedCheese.name,
        veggies: selectedVeggies.map((v) => v.name),
        totalPrice,
      };
      localStorage.setItem('customPizza', JSON.stringify(pizzaConfig));
      navigate('/order-summary');
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
            Step {step} of 4
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Craft Your Signature Pizza
          </h1>
          <p className="text-sm text-slate-400">
            Pick freshly sourced artisanal ingredients
          </p>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto">
          {[
            { num: 1, label: 'Base' },
            { num: 2, label: 'Sauce' },
            { num: 3, label: 'Cheese' },
            { num: 4, label: 'Veggies' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              className={`p-2.5 rounded-xl text-center border transition-all ${
                step === s.num
                  ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30 font-bold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] uppercase">Step {s.num}</div>
              <div className="text-xs font-semibold mt-0.5">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Step Content Box */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          
          {/* STEP 1: BASE */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">1. Choose Crust / Base</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INGREDIENTS.bases.map((base) => (
                  <div
                    key={base.name}
                    onClick={() => setSelectedBase(base)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                      selectedBase?.name === base.name
                        ? 'bg-red-500/10 border-red-500 text-white shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-semibold">{base.name}</span>
                    <span className="text-emerald-400 font-bold">₹{base.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SAUCE */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">2. Select Your Sauce</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INGREDIENTS.sauces.map((sauce) => (
                  <div
                    key={sauce.name}
                    onClick={() => setSelectedSauce(sauce)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                      selectedSauce?.name === sauce.name
                        ? 'bg-red-500/10 border-red-500 text-white shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-semibold">{sauce.name}</span>
                    <span className="text-emerald-400 font-bold">₹{sauce.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: CHEESE */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">3. Pick Your Cheese</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INGREDIENTS.cheeses.map((cheese) => (
                  <div
                    key={cheese.name}
                    onClick={() => setSelectedCheese(cheese)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                      selectedCheese?.name === cheese.name
                        ? 'bg-red-500/10 border-red-500 text-white shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-semibold">{cheese.name}</span>
                    <span className="text-emerald-400 font-bold">₹{cheese.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: VEGGIES */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">4. Add Veggies / Toppings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INGREDIENTS.veggies.map((veg) => {
                  const isChecked = selectedVeggies.some((v) => v.name === veg.name);
                  return (
                    <div
                      key={veg.name}
                      onClick={() => toggleVeggie(veg)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                        isChecked
                          ? 'bg-red-500/10 border-red-500 text-white shadow-md'
                          : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                        />
                        <span className="font-semibold">{veg.name}</span>
                      </div>
                      <span className="text-emerald-400 font-bold">₹{veg.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Live Total & Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Live Pizza Total</div>
            <div className="text-2xl font-black text-emerald-400">₹{totalPrice}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {selectedBase.name} + {selectedSauce.name} + {selectedCheese.name} + {selectedVeggies.length} Veggies
            </div>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 sm:w-auto px-8 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg shadow-red-600/30"
            >
              {step === 4 ? 'Review Order ➔' : `Next: Step ${step + 1} ➔`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}