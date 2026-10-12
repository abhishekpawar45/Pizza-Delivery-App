import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const featuredPizzas = [
    {
      id: 1,
      name: 'Fiery Paneer & Red Paprika',
      desc: 'Tandoori marinated paneer, spicy red paprika, crisp capsicum on a cheesy bed.',
      price: '₹299',
      tag: 'Bestseller',
      badgeColor: 'bg-red-500/10 text-red-500 border-red-500/20',
      icon: '🌶️'
    },
    {
      id: 2,
      name: 'Truffle Mushroom Melt',
      desc: 'Caramelized onions, sautéed wild mushrooms, mozzarella with garlic butter base.',
      price: '₹349',
      tag: "Chef's Special",
      badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      icon: '🍄'
    },
    {
      id: 3,
      name: 'Farmhouse Garden Supreme',
      desc: 'Fresh golden sweet corn, ripe black olives, bell peppers, melted cheddar.',
      price: '₹259',
      tag: 'Fresh Veg',
      badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      icon: '🥦'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 selection:bg-red-500 selection:text-white">
      {/* Glow Effect Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-red-600/20 via-orange-500/15 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/60 backdrop-blur-md mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold tracking-wide text-slate-300">
            Fresh Dough Baked Daily &middot; 30 Mins Guaranteed
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white max-w-4xl mx-auto">
          Crave It. Build It. <br />
          <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
            Delivered Hot & Cheesy.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Select from handcrafted bases, slow-simmered sauces, and fresh gourmet toppings. Customize your slice or pick our signature classics.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/builder"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            🍕 Build Your Custom Pizza
          </Link>
          <a
            href="#menu"
            className="px-7 py-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 font-semibold text-sm transition-all duration-200"
          >
            Explore Menu ↓
          </a>
        </div>
      </section>

      {/* Popular Menu Section */}
      <section id="menu" className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-800/60">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Popular Masterpieces</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Directly baked from our stone oven</p>
          </div>
          <Link to="/builder" className="text-xs font-bold text-orange-400 hover:text-orange-300 transition">
            Create Custom &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPizzas.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-slate-900/70 border border-slate-800/80 p-6 flex flex-col justify-between backdrop-blur-sm hover:border-slate-700 hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Price</span>
                  <span className="text-lg font-black text-white">{item.price}</span>
                </div>
                <Link
                  to="/builder"
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-red-600 text-white text-xs font-bold transition-all duration-200"
                >
                  Order Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;