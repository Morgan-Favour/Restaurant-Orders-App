import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";

const OrderForm = ({ onOrderAdded }) => {
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Pending");

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const newOrder = {
        customer,
        items: items.split(",").map((item) => item.trim()), // Convert comma-separated string to array
        time,
        date,
        status,
      };

      try {
        const res = await fetch("https://6804a7f279cb28fb3f5b7c04.mockapi.io/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOrder),
        });

        if (res.ok) {
          const data = await res.json();
          toast.success("Order placed successfully!");
          setCustomer("");
          setItems("");
          setTime("");
          setDate("");
          setStatus("Pending");
          if (onOrderAdded) {
            onOrderAdded(data); // Callback to refresh the order list
          }
        } else {
          throw new Error("Failed to place order");
        }
      } catch (err) {
        console.error("Error placing order:", err);
        toast.error("Failed to place order!");
      }
    },
    [customer, items, time, date, status, onOrderAdded]
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Place a New Order</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
        <input
          type="text"
          placeholder="Enter customer name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Items (comma-separated)</label>
        <input
          type="text"
          placeholder="e.g., Pizza, Burger, Fries"
          value={items}
          onChange={(e) => setItems(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Time (e.g., 14:30)</label>
        <input
          type="text"
          placeholder="Enter time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Date (e.g., 2023-10-15)</label>
        <input
          type="text"
          placeholder="Enter date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Delivered">Delivered</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-sm font-medium transition-all"
      >
        Place Order
      </button>
    </form>
  );
};

export default OrderForm;
