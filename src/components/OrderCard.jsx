import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

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
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Preparing":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, [status]);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 space-y-3 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-xl font-bold text-gray-800">Order No.{id}</h2>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Customer:</span> {customer}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Items:</span> {items.join(", ")}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Time:</span> {time}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Date:</span> {date}
      </p>
      <p className="text-sm">
        <span className="font-semibold">Status:</span>{" "}
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusStyles}`}
        >
          {status}
        </span>
      </p>

      {status !== "Completed" && (
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          className={`mt-3 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-sm font-medium transition-all duration-200 ${
            isCompleting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isCompleting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                ></path>
              </svg>
              Completing...
            </span>
          ) : (
            "Complete Order"
          )}
        </button>
      )}
      <Link
        to={`/order/${id}`}
        className="block mt-2 text-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
      >
        View Details
      </Link>
    </div>
  );
}

export default React.memo(OrderCard);