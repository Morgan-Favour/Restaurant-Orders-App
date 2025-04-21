import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import "../styles.css";

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
        items: items.split(",").map((item) => item.trim()),
        time,
        date,
        status,
      };

      try {
        console.log("Submitting order:", newOrder);
        const res = await fetch("https://6804a7f279cb28fb3f5b7c04.mockapi.io/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOrder),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to place order: Status ${res.status}, ${errorText}`);
        }

        const data = await res.json();
        console.log("Order created:", data);
        toast.success("Order placed successfully!");
        setCustomer("");
        setItems("");
        setTime("");
        setDate("");
        setStatus("Pending");
        if (onOrderAdded) {
          onOrderAdded(data);
        }
      } catch (err) {
        console.error("Error placing order:", err.message, err.stack);
        toast.error(`Failed to place order: ${err.message}`);
      }
    },
    [customer, items, time, date, status, onOrderAdded]
  );

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Place a New Order</h2>
      <div className="form-group">
        <label className="form-label">Customer Name</label>
        <input
          type="text"
          placeholder="Enter customer name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Items (comma-separated)</label>
        <input
          type="text"
          placeholder="e.g., Pizza, Burger, Fries"
          value={items}
          onChange={(e) => setItems(e.target.value)}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Time (e.g., 14:30)</label>
        <input
          type="text"
          placeholder="Enter time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Date (e.g., 2023-10-15)</label>
        <input
          type="text"
          placeholder="Enter date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="form-select"
        >
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Delivered">Delivered</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <button type="submit" className="form-button">
        Place Order
      </button>
    </form>
  );
};

export default OrderForm;