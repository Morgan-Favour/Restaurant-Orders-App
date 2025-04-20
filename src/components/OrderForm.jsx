import React, { useState } from "react";

const OrderForm = () => {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newOrder = {
      item,
      quantity,
      status: "pending"
    };

    fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newOrder)
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Order placed!");
        setItem("");
        setQuantity(1);
        // Optionally trigger a refresh of the list here
      })
      .catch((err) => console.error("Error placing order:", err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter item"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        required
      />
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        required
      />
      <button type="submit">Place Order</button>
    </form>
  );
};

export default OrderForm;
