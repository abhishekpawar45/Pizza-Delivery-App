import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editValues, setEditValues] = useState({});

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/inventory');
      setItems(res.data);
      const initialEdits = {};
      res.data.forEach((item) => {
        initialEdits[item._id] = item.stock;
      });
      setEditValues(initialEdits);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdate = async (id) => {
    try {
      const newStock = editValues[id];
      await axios.put(`http://localhost:5000/api/inventory/${id}`, {
        stock: newStock
      });
      alert('Stock updated successfully!');
      fetchInventory();
    } catch (err) {
      alert('Failed to update stock');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Inventory...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        📦 Inventory Management Dashboard
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 font-semibold text-gray-700">Item Name</th>
              <th className="p-3 font-semibold text-gray-700">Category</th>
              <th className="p-3 font-semibold text-gray-700">Current Stock</th>
              <th className="p-3 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-800">{item.name}</td>
                <td className="p-3 capitalize text-gray-600">{item.category}</td>
                <td className="p-3">
                  <input
                    type="number"
                    value={editValues[item._id] !== undefined ? editValues[item._id] : item.stock}
                    onChange={(e) =>
                      setEditValues({ ...editValues, [item._id]: e.target.value })
                    }
                    className={`w-24 p-1.5 border rounded text-center font-bold ${
                      item.stock < 20 ? 'border-red-500 text-red-600 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {item.stock < 20 && (
                    <span className="ml-2 text-xs text-red-500 font-semibold">Low Stock!</span>
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleUpdate(item._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition"
                  >
                    Save Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;