import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "../styles.css";

function OrderCard({ order, onComplete }) {
  const { id, customer, items, time, status, date } = order;
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    await onComplete();
    setIsCompleting(false);
  };

  const statusStyles = useMemo(() => {
    switch (status) {
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
  }, [status]);

  return (
    <div className="card">
      <h2 className="card-title">Order No.{id}</h2>
      <p className="card-text">
        <span className="font-semibold">Customer:</span> {customer}
      </p>
      <p className="card-text">
        <span className="font-semibold">Items:</span> {items.join(", ")}
      </p>
      <p className="card-text">
        <span className="font-semibold">Time:</span> {time}
      </p>
      <p className="card-text">
        <span className="font-semibold">Date:</span> {date}
      </p>
      <p className="card-text">
        <span className="font-semibold">Status:</span>{" "}
        <span className={statusStyles}>{status}</span>
      </p>

      {status !== "Completed" && (
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          className={`form-button ${isCompleting ? "disabled" : ""}`}
        >
          {isCompleting ? "Completing..." : "Complete Order"}
        </button>
      )}
      <Link to={`/order/${id}`} className="link">
        View Details
      </Link>
    </div>
  );
}

export default React.memo(OrderCard);