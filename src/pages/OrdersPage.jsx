import { useEffect, useMemo, useState } from "react";
import { OrdersTable, PageHeading } from "../components/dashboard/DashboardUI";
import api from "@/middleware/apiMiddleware";
import { toast } from "sonner";
import { formatDate } from "@/utils/DateFormatter";

const filters = [
  "All orders",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Received",
  "Cancelled",
];
const PAGE_SIZE = 10;

function formatOrder(order) {
  return {
    ...order,
    status: order.status?.charAt(0).toUpperCase() + order.status?.slice(1),
    createdAt: formatDate(order.createdAt),
  };
}

function OrdersPage({ admin, onStatusUpdate }) {
  const [activeFilter, setActiveFilter] = useState("all orders");
  const [currentPage, setCurrentPage] = useState(1);
  const [adminOrders, setAdminOrders] = useState([]);
  const [memberOrders, setMemberOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        if (admin) {
          const response = await api.get("/orders/all", {
            params: {
              page: currentPage,
              limit: PAGE_SIZE,
              ...(activeFilter !== "all orders" ? { status: activeFilter } : {}),
            },
          });
          if (!isCurrent) return;
          if (currentPage > response.data.totalPages) {
            setCurrentPage(response.data.totalPages);
            return;
          }
          setAdminOrders(response.data.orders.map(formatOrder));
          setTotalOrders(response.data.totalOrders);
          setTotalPages(response.data.totalPages);
        } else {
          const response = await api.get("/orders/my-orders?all=true");
          if (!isCurrent) return;
          const orders = Array.isArray(response.data.orders)
            ? response.data.orders
            : [];
          setMemberOrders(orders);
          setTotalOrders(orders.length);
        }
      } catch (error) {
        if (isCurrent) {
          toast.error(error.response?.data?.message || "Unable to load orders.");
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    loadOrders();
    return () => {
      isCurrent = false;
    };
  }, [admin, currentPage, activeFilter, reloadKey]);

  const displayedOrders = admin ? adminOrders : memberOrders.map(formatOrder);
  const visibleOrders = useMemo(
    () => admin || activeFilter === "all orders"
      ? displayedOrders
      : displayedOrders.filter(
          (order) => order.status?.toLowerCase() === activeFilter,
        ),
    [activeFilter, admin, displayedOrders],
  );

  const updateAdminOrderStatus = async (orderId, status) => {
    const updated = await onStatusUpdate?.(orderId, status);
    if (updated) setReloadKey((current) => current + 1);
  };

  const updateCustomerOrderStatus = async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/my-orders/${orderId}/status`, {
        status,
      });
      setMemberOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? { ...order, status: response.data.order.status }
            : order,
        ),
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to update this order.",
      );
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter.toLowerCase());
    setCurrentPage(1);
  };

  return (
    <>
      <PageHeading
        eyebrow={admin ? "Store management" : "Your account"}
        title={admin ? "All orders" : "Your orders"}
        description={
          admin
            ? "Review and manage customer orders."
            : "Track your purchases and revisit your order history."
        }
      />

      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter orders by status"
      >
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={activeFilter === filter.toLowerCase()}
            onClick={() => handleFilterChange(filter)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${activeFilter === filter.toLowerCase() ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-5 rounded-xl border border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500">
          Loading orders…
        </div>
      ) : visibleOrders.length ? (
        <div className="mt-5">
          <OrdersTable
            admin={admin}
            rows={visibleOrders}
            onStatusUpdate={admin ? updateAdminOrderStatus : undefined}
            onCustomerStatusUpdate={!admin ? updateCustomerOrderStatus : undefined}
          />
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-zinc-300 px-5 py-14 text-center">
          <p className="font-semibold">No {activeFilter} yet.</p>
          <p className="mt-1 text-sm text-zinc-500">
            Orders will appear here when they match this status.
          </p>
        </div>
      )}

      {admin && !isLoading && totalOrders > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-zinc-500">
            Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, totalOrders)}–
            {Math.min(currentPage * PAGE_SIZE, totalOrders)} of {totalOrders} orders
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage <= 1}
              className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-bold transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-zinc-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage >= totalPages}
              className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-bold transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default OrdersPage;
