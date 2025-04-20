import React, { useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import OrderCard from "./OrderCard";
import { toast } from "react-toastify";

export default function OrderList({ orders, setOrders, loadMore, hasMore }) {
  const handleCompleteOrder = useCallback(
    async (orderId) => {
      try {
        const res = await fetch(`/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Completed" }),
        });

        if (res.ok) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === orderId ? { ...order, status: "Completed" } : order
            )
          );
          toast.success("Order marked as Completed!");
        } else {
          console.error("Failed to update order");
          toast.error("Failed to update order!");
        }
      } catch (error) {
        console.error("Error completing order:", error);
        toast.error("Error completing order!");
      }
    },
    [setOrders]
  );

  return (
    <InfiniteScroll
      dataLength={orders.length}
      next={loadMore}
      hasMore={hasMore}
      loader={
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        </div>
      }
      endMessage={
        <p className="text-center text-gray-500 py-4">No more orders to load.</p>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg animate-fade-in">
            No orders found.
          </p>
        ) : (
          orders.map((order, index) => (
            <div
              key={order.id}
              className="transform transition-all duration-500 ease-out"
              style={{ animation: `fadeInUp 0.5s ease ${index * 0.1}s forwards` }}
            >
              <OrderCard order={order} onComplete={() => handleCompleteOrder(order.id)} />
            </div>
          ))
        )}
      </div>
    </InfiniteScroll>
  );
}