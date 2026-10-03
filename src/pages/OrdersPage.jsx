import { useMemo, useState } from "react";
import { OrdersTable, PageHeading } from "../components/dashboard/DashboardUI";

const filters = [
  "All orders",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function OrdersPage({ admin, orderRows, onStatusUpdate }) {
  const [activeFilter, setActiveFilter] = useState("All orders");
  const visibleOrders = useMemo(
    () =>
      activeFilter === "All orders"
        ? orderRows
        : orderRows.filter((order) => order.status === activeFilter),
    [activeFilter, orderRows],
  );

  return (
    <>
      <PageHeading
        eyebrow={admin ? "Store management" : "Your account"}
        title={admin ? "All orders" : "Your orders"}
        description={
          admin
            ? "Review and manage recent customer orders."
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
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${activeFilter === filter ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {visibleOrders?.length ? (
        <div className="mt-5">
          <OrdersTable
            admin={admin}
            rows={visibleOrders}
            onStatusUpdate={onStatusUpdate}
          />
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-zinc-300 px-5 py-14 text-center">
          <p className="font-semibold">No {activeFilter.toLowerCase()} yet.</p>
          <p className="mt-1 text-sm text-zinc-500">
            Orders will appear here when they match this status.
          </p>
        </div>
      )}

      {admin && (
        <p className="mt-4 text-xs text-zinc-500">
          Showing {visibleOrders?.length} of {orderRows?.length} sample orders
        </p>
      )}
    </>
  );
}

export default OrdersPage;
