import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";

function OrderDetails({ orders }) {
  const { orderId } = useParams();
  const order = useMemo(() => {
    return orders.find((order) => order.id.toString() === orderId);
  }, [orders, orderId]);

  const statusStyles = useMemo(() => {
    if (!order) return "";
    switch (order.status) {
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
  }, [order]);

  if (!order) {
    return (
      <div className="p-6 text-center text-gray-500 text-lg animate-fade-in">
        Order not found!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-lg w-full animate-fade-in-up">
        <h2 className="text-3xl font-bold mb-6 text-red-600 flex items-center gap-2">
          🍽️ Order #{order.id}
        </h2>

        <div className="space-y-4">
          <div>
            <strong className="text-gray-700">Customer:</strong>{" "}
            <span className="text-gray-600">{order.customer}</span>
          </div>

          <div>
            <strong className="text-gray-700">Items Ordered:</strong>
            <ul className="list-disc ml-6 text-gray-600">
              {order.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <strong className="text-gray-700">Order Time:</strong>{" "}
            <span className="text-gray-600">{order.time}</span>
          </div>

          <div>
            <strong className="text-gray-700">Status:</strong>{" "}
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusStyles}`}
            >
              {order.status}
            </span>
          </div>
        </div>

        <Link
          to="/"
          className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-sm font-medium transition-all"
        >
          ⬅ Back to Orders
        </Link>
      </div>
    </div>
  );
}

export default React.memo(OrderDetails);