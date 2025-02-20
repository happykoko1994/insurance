"use client";

import "../app/globals.css";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

import OrderList from "../components/OrderList";
import Pagination from "../components/Pagination";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(5);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Ошибка при загрузке заказов");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  async function deleteOrder(id) {
    if (!confirm("Удалить этот заказ?")) return;

    setDeletingOrderId(id);

    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Ошибка при удалении заказа");

      setOrders(orders.filter((order) => order._id !== id));
      toast.success("Заказ успешно удалён!");

      if ((currentPage - 1) * ordersPerPage >= orders.length - 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
    } catch (err) {
      toast.error(err.message || "Произошла ошибка при удалении");
    } finally {
      setDeletingOrderId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <ClipLoader color="#4A90E2" size={50} />
          <p className="text-gray-500 mt-4">Загрузка заказов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-gray-800">Заявки</h1>

      <div className="max-w-3xl w-full bg-white p-6 mt-6 rounded-xl shadow-lg">
        <div className="flex justify-end items-center mb-4 space-x-3">
          <span className="text-lg">Заявок на странице:</span>
          <select
            className="border p-2 rounded-md"
            value={ordersPerPage}
            onChange={(e) => {
              setOrdersPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>

        {/* Контейнер списка заказов */}
        <div className="space-y-4">
          <OrderList
            orders={currentOrders}
            deleteOrder={deleteOrder}
            deletingOrderId={deletingOrderId}
          />
        </div>

        {/* Пагинация */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      <ToastContainer />
    </div>
  );
}
