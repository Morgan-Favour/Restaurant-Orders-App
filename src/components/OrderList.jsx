import React, { useCallback } from "react";
import OrderCard from "./OrderCard";
import { toast } from "react-toastify";
import "../styles.css";

export default function OrderList({ orders, setOrders }) {
  const handleCompleteOrder = useCallback(
    async (orderId) => {
      try {
        console.log(`Completing order ID: ${orderId}`);
        const res = await fetch(`https://6804a7f279cb28fb3f5b7c04.mockapi.io/orders/${orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Completed" }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to update order: Status ${res.status}, ${errorText}`);
        }

        const data = await res.json();
        console.log("Order updated:", data);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "Completed" } : order
          )
        );
        toast.success("Order marked as Completed!");
      } catch (error) {
        console.error("Error completing order:", error.message, error.stack);
        toast.error(`Failed to update order: ${error.message}`);
      }
    },
    [setOrders]
  );

  return (
    <div className="order-list">
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div
            key={order.id}
            style={{ animationDelay: `${index * 0.1}s` }}
            className="animate-fade-in-up"
          >
            <OrderCard order={order} onComplete={() => handleCompleteOrder(order.id)} />
          </div>
        ))
      )}
    </div>
  );
}