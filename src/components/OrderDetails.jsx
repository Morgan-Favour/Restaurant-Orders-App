import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles.css";

function OrderDetails({ orders }) {
  const { orderId } = useParams();
  const order = useMemo(() => {
    return orders.find((order) => order.id.toString() === orderId);
  }, [orders, orderId]);

  const statusStyles = useMemo(() => {
    if (!order) return "card-status default";
    switch (order.status) {
      case "Completed":
        return "card-status completed";
      case "Pending":
        return "card-status pending";
      case "Preparing":
        return "card-status preparing";
      case "Delivered":
        return "card-status delivered";
      default:
        return "card-status default";
    }
  }, [order]);

  if (!order) {
    return (
      <div className="no-orders">
        Order not found!
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="details-card animate-fade-in-up">
        <h2 className="details-title">🍽️ Order #{order.id}</h2>

        <div className="details-content">
          <div>
            <strong>Customer:</strong> <span>{order.customer}</span>
          </div>

          <div>
            <strong>Items Ordered:</strong>
            <ul className="details-list">
              {order.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Order Time:</strong> <span>{order.time}</span>
          </div>

          <div>
            <strong>Status:</strong> <span className={statusStyles}>{order.status}</span>
          </div>
        </div>

        <Link to="/" className="link">
          ⬅ Back to Orders
        </Link>
      </div>
    </div>
  );
}

export default React.memo(OrderDetails);