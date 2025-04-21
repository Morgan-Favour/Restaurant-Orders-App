import React, { useEffect, useState, useMemo, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderList from "./components/OrderList";
import OrderDetails from "./components/OrderDetails";
import OrderForm from "./components/OrderForm";
import "./styles.css";

export default function App() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = useCallback(async (retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const url = `https://6804a7f279cb28fb3f5b7c04.mockapi.io/orders`;
        console.log(`Fetching orders: ${url} (Attempt ${attempt})`);
        const res = await fetch(url);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorText}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected API response: Data is not an array");
        }

        // Flatten the response: extract orders from nested 'orders' array and include top-level orders
        const flattenedOrders = data.reduce((acc, item) => {
          if (item.orders && Array.isArray(item.orders)) {
            return [...acc, ...item.orders];
          } else if (item.id && item.customer && item.items && item.time && item.date && item.status) {
            return [...acc, item];
          }
          return acc;
        }, []).filter(order => {
          // Validate order fields
          return (
            typeof order.id === "string" &&
            typeof order.customer === "string" &&
            Array.isArray(order.items) &&
            typeof order.time === "string" &&
            typeof order.date === "string" &&
            typeof order.status === "string"
          );
        });

        console.log(`Received ${flattenedOrders.length} valid orders`, flattenedOrders);
        setOrders(flattenedOrders);
        setIsLoading(false);
        return; // Success, exit retry loop
      } catch (err) {
        console.error(`Attempt ${attempt} failed:`, err.message, err.stack);
        if (attempt === retries) {
          toast.error(`Failed to fetch orders: ${err.message}`);
          setIsLoading(false);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
      }
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

    if (filterStatus !== "All") {
      result = result.filter((order) => order.status === filterStatus);
    }

    if (sortBy === "time") {
      result.sort((a, b) => {
        try {
          return new Date(`1970-01-01 ${b.time}`) - new Date(`1970-01-01 ${a.time}`);
        } catch {
          return 0; // Skip invalid times
        }
      });
    } else if (sortBy === "date") {
      result.sort((a, b) => {
        try {
          return new Date(b.date) - new Date(a.date);
        } catch {
          return 0; // Skip invalid dates
        }
      });
    }

    return result;
  }, [orders, filterStatus, sortBy]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Router>
      <div className="app-container">
        <h1 className="title">📋 Restaurant Order Management</h1>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <div className="main-container">
                  <button onClick={openModal} className="form-button mb-4">
                    Add New Order
                  </button>
                  {isModalOpen && (
                    <div className="modal">
                      <div className="modal-content">
                        <button onClick={closeModal} className="modal-close">
                          ×
                        </button>
                        <OrderForm
                          onOrderAdded={(newOrder) => {
                            setOrders((prev) => [newOrder, ...prev]);
                            closeModal();
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="filter-sort-container">
                    <div className="filter-group">
                      <label className="label">Filter by Status:</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="select"
                      >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div className="filter-group">
                      <label className="label">Sort by:</label>
                      <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="select"
                      >
                        <option value="time">Time</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                  </div>
                  <OrderList orders={filteredOrders} setOrders={setOrders} />
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