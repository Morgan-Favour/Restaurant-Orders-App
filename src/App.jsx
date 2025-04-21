import React, { useEffect, useState, useMemo, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderList from "./components/OrderList";
import OrderDetails from "./components/OrderDetails";

export default function App() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("date"); // Changed to string since sortBy is a single value
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10; // Number of orders per page

  const fetchOrders = useCallback(async (pageNum, append = false) => {
    try {
      const res = await fetch(`https://6804a7f279cb28fb3f5b7c04.mockapi.io/orders?_page=${pageNum}&_limit=${limit}`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setOrders((prev) => (append ? [...prev, ...data] : data));
      setHasMore(data.length === limit);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
      toast.error("Failed to fetch orders!");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const loadMoreOrders = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prev) => {
        const nextPage = prev + 1;
        fetchOrders(nextPage, true);
        return nextPage;
      });
    }
  }, [isLoading, hasMore, fetchOrders]);

  // Debounce filter/sort changes
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleFilterChange = debounce((value) => {
    setFilterStatus(value);
  }, 300);

  const handleSortChange = debounce((value) => {
    setSortBy(value);
  }, 300);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filter by status
    if (filterStatus !== "All") {
      result = result.filter((order) => order.status === filterStatus);
    }

    // Sort by time or date
    if (sortBy === "time") {
      result.sort((a, b) => new Date(`1970-01-01 ${b.time}`) - new Date(`1970-01-01 ${a.time}`));
    } else if (sortBy === "date") {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return result;
  }, [orders, filterStatus, sortBy]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8 drop-shadow-md">
          📋 Restaurant Order Management
        </h1>

        {isLoading && page === 1 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <Routes>
            // Inside the Routes in App.js
<Route
  path="/"
  element={
    <div className="max-w-7xl mx-auto">
      <OrderForm onOrderAdded={(newOrder) => setOrders((prev) => [newOrder, ...prev])} />
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-sm font-semibold text-gray-700">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-sm font-semibold text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="time">Time</option>
            <option value="date">Date</option>
          </select>
        </div>
      </div>

      <OrderList
        orders={filteredOrders}
        setOrders={setOrders}
        loadMore={loadMoreOrders}
        hasMore={hasMore}
      />
    </div>
  }
/>
                </div>
              }
            />
            <Route path="/order/:orderId" element={<OrderDetails orders={orders} />} />
          </Routes>
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />
      </div>
    </Router>
  );
}
