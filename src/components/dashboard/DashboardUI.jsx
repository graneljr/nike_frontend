import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  faArrowRight,
  faArrowTrendDown,
  faArrowTrendUp,
  faBox,
  faMinus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/DateFormatter";
import socket from "@/socket";
import { toast } from "sonner";
import api from "@/middleware/apiMiddleware";

const money = (amount) => `₱${Number(amount).toLocaleString()}`;

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function useTablePagination(items, pageSize = 10) {
  const [page, setPage] = useState(1);
  const safeItems = Array.isArray(items) ? items : [];
  const pageCount = Math.max(1, Math.ceil(safeItems.length / pageSize));

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, pageCount));
  }, [pageCount]);

  return {
    page,
    pageCount,
    pageItems: safeItems.slice((page - 1) * pageSize, page * pageSize),
    setPage,
  };
}

export function TablePagination({
  itemCount,
  page,
  pageCount,
  pageSize = 10,
  onPageChange,
}) {
  if (itemCount <= pageSize) return null;

  const firstItem = (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, itemCount);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-zinc-200 bg-white px-5 py-3 sm:flex-row">
      <p className="text-xs text-zinc-500">
        Showing {firstItem}–{lastItem} of {itemCount}
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onPageChange((currentPage) => Math.max(1, currentPage - 1))}
          disabled={page <= 1}
          className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-bold transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-xs font-semibold text-zinc-600">
          Page {page} of {pageCount}
        </span>
        <button
          type="button"
          onClick={() => onPageChange((currentPage) => Math.min(pageCount, currentPage + 1))}
          disabled={page >= pageCount}
          className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-bold transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function SectionTitle({ title, link, to }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-bold">{title}</h2>
      {link && (
        <Link
          to={to}
          className="text-xs font-bold text-zinc-500 transition hover:text-black"
        >
          {link} <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
        </Link>
      )}
    </div>
  );
}

export function Status({ children }) {
  const color =
    children === "Delivered" || children === "Received" || children === "Active"
      ? "bg-zinc-100 text-zinc-700"
      : children === "Shipped"
        ? "bg-zinc-200 text-zinc-800"
        : children === "Cancelled"
          ? "bg-zinc-100 text-zinc-500"
          : "bg-black text-white";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${color}`}
    >
      {children}
    </span>
  );
}

export function MetricCard({
  icon,
  label,
  value,
  change,
  trend,
  trendPeriod = "vs last month",
}) {
  const hasTrend = typeof trend === "number" || trend === "new";
  const trendIcon =
    trend === "new"
      ? faArrowTrendUp
      : trend > 0
        ? faArrowTrendUp
        : trend < 0
          ? faArrowTrendDown
          : faMinus;
  const trendColor =
    trend === "new" || trend > 0
      ? "text-emerald-700"
      : trend < 0
        ? "text-red-600"
        : "text-zinc-500";
  const trendValue = !hasTrend
    ? ""
    : trend === "new"
      ? "New"
      : `${trend > 0 ? "+" : ""}${trend.toFixed(1)}%`;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
          <FontAwesomeIcon icon={icon} />
        </span>
        <span
          className={`flex items-center gap-1 text-xs font-semibold ${hasTrend ? trendColor : "text-zinc-500"}`}
        >
          {hasTrend ? (
            <>
              <FontAwesomeIcon icon={trendIcon} /> {trendValue} · {trendPeriod}
            </>
          ) : (
            change
          )}
        </span>
      </div>
      <p className="mt-5 text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight">{value}</p>
    </div>
  );
}

export function Modal({ eyebrow, title, onClose, children }) {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion =
    prefersReducedMotion ||
    document.documentElement.dataset.reduceMotion === "true";

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.18, ease: "easeOut" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-7"
        initial={{
          opacity: 0,
          y: reduceMotion ? 0 : 18,
          scale: reduceMotion ? 1 : 0.98,
        }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{
          opacity: 0,
          y: reduceMotion ? 0 : 10,
          scale: reduceMotion ? 1 : 0.98,
        }}
        transition={{
          duration: reduceMotion ? 0.01 : 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              {eyebrow}
            </p>
            <h2
              id="modal-title"
              className="mt-2 text-2xl font-black tracking-tight"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </motion.section>
    </motion.div>
  );
}

function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;
  const orderItems = Array.isArray(order.items) ? order.items : [];
  const formattedOrderDate = formatDate(order.createdAt);
  const [payment, setPayment] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const generatePaymentQrCode = async (orderId) => {
    try {
      const paymentResponse = await api.post("/payment/process_payment", {
        orderId: orderId,
      });
      setOrderId(orderId);
      setPayment(paymentResponse.data);
      socket.emit("join-order", orderId);
      toast.info("Order created. Scan the code to complete payment.");
    } catch (error) {}
  };

  useEffect(() => {
    const handlePaymentSuccess = (data) => {
      console.log("PAYMENT SUCCESS EVENT:", data);

      if (data.orderId === orderId) {
        console.log("Correct order payment received!");
        toast.success("Payment successful!");
        setPayment(null)
        onClose()
      }
    };

    socket.on("payment-success", handlePaymentSuccess);

    return () => {
      socket.off("payment-success", handlePaymentSuccess);
    };
  }, [orderId]);
  return (
    <Modal eyebrow="Order details" title={order?._id} onClose={onClose}>
      {payment && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-5">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 text-sm text-zinc-700 shadow-xl">
            <p>Payment QR Code:</p>
            <img
              src={payment.qrCode}
              alt="Payment QR Code"
              className="mx-auto mt-3 h-48 w-48"
            />
            <p className="mt-2 text-center">
              Amount: ₱{payment.amount.toLocaleString()}
            </p>
            <button
              type="button"
              onClick={() => setPayment(null)}
              className="mt-4 w-full rounded-full border border-zinc-300 py-2 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-5">
        <div>
          <p className="text-xs text-zinc-500">Order date</p>
          <p className="mt-1 text-sm font-semibold">{formattedOrderDate}</p>
        </div>
        <Status>{order?.status}</Status>
      </div>
      {order?.userId?.fullName && (
        <div className="border-b border-zinc-200 py-5">
          <p className="text-xs text-zinc-500">Customer</p>
          <p className="mt-1 text-sm font-semibold">
            {order?.userId?.fullName}
          </p>
        </div>
      )}
      {order?.paymentMethod && (
        <div className="border-b border-zinc-200 py-5">
          <p className="text-xs text-zinc-500">Payment Method</p>
          <p className="mt-1 text-sm font-semibold">{order?.paymentMethod}</p>
        </div>
      )}
      {order?.status && (
        <div className="border-b border-zinc-200 py-5">
          <p className="text-xs text-zinc-500">Order Status</p>
          <p className="mt-1 text-sm font-semibold">{order?.status}</p>
        </div>
      )}
      {order?.paymentStatus && (
        <div className="border-b border-zinc-200 py-5">
          <p className="text-xs text-zinc-500">Payment Status</p>
          <p className="mt-1 text-sm font-semibold">{order?.paymentStatus}</p>
        </div>
      )}
      <div className="border-b border-zinc-200 py-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Items
        </p>
        <div className="flex items-center gap-3 rounded-lg bg-zinc-50 p-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-200">
            <FontAwesomeIcon icon={faBox} className="text-zinc-500" />
          </div>
          <div className="min-w-0 flex-1 flex-col gap-2">
            {orderItems.length > 0 ? (
              orderItems.map((item) => (
                <div key={item?._id ?? `${item?.productId?._id}-${item?.size}`}>
                  <p className="text-sm font-bold">
                    {item?.productId?.name ?? "Unknown product"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {item?.size} · Qty {item?.quantity ?? 0}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">
                {typeof order.items === "string" && order.items
                  ? order.items
                  : "No item details available."}
              </p>
            )}
          </div>
          <p className="text-sm font-bold">{money(order?.totalAmount)}</p>
        </div>
      </div>
      <div className="flex justify-between pt-5 text-sm">
        <span className="font-semibold">Order total</span>
        <span className="font-black">{money(order?.totalAmount)}</span>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-gray-300 px-5 py-3 text-sm font-bold text-black transition hover:bg-gray-400"
        >
          Done
        </button>
        {order?.paymentMethod === "online" &&
          order?.paymentStatus === "pending"  &&(
            <button
              type="button"
              onClick={() => generatePaymentQrCode(order?._id)}
              className="mt-6 w-full rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
            >
              Pay Now!
            </button>
          )}
      </div>
    </Modal>
  );
}

export function OrdersTable({
  admin = false,
  rows,
  onStatusUpdate,
  onCustomerStatusUpdate,
}) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusOrder, setStatusOrder] = useState(null);
  const [nextStatus, setNextStatus] = useState("");
  const orderRows = Array.isArray(rows) ? rows : [];
  const orderPagination = useTablePagination(orderRows);
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-zinc-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-4">Order</th>
                {admin && <th className="px-5 py-4">Customer</th>}
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Items</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            {rows ? (
              <tbody className="divide-y divide-zinc-100">
                {orderPagination.pageItems.map((order) => (
                  <tr key={order?._id} className="bg-white">
                    <td className="px-5 py-4 font-bold">{order?._id}</td>
                    {admin && (
                      <td className="px-5 py-4">{order?.userId?.fullName}</td>
                    )}
                    <td className="px-5 py-4 text-zinc-500">
                      {formatDate(order?.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      {Array.isArray(order?.items)
                        ? order.items.reduce(
                            (total, item) =>
                              total + (Number(item?.quantity) || 0),
                            0,
                          )
                        : typeof order?.items === "string"
                          ? order.items
                          : 0}
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      {money(order?.totalAmount)}
                    </td>
                    <td className="px-5 py-4">
                      <Status>{order?.status}</Status>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="whitespace-nowrap rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-bold transition hover:border-black hover:bg-black hover:text-white"
                        >
                          Details
                        </button>
                        {admin && onStatusUpdate && (
                          <button
                            disabled={
                              order?.status === "received" ||
                              order?.status === "cancelled"
                            }
                            type="button"
                            onClick={() => {
                              setStatusOrder(order);
                              setNextStatus(order?.status);
                            }}
                            className="whitespace-nowrap rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-700 transition hover:bg-zinc-200 hover:text-black"
                          >
                            Update status
                          </button>
                        )}
                        {!admin &&
                          onCustomerStatusUpdate &&
                          order?.status === "Processing" && (
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Cancel this processing order?",
                                  )
                                ) {
                                  onCustomerStatusUpdate(
                                    order._id,
                                    "cancelled",
                                  );
                                }
                              }}
                              className="whitespace-nowrap rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-bold transition hover:border-red-600 hover:text-red-600"
                            >
                              Cancel order
                            </button>
                          )}
                        {!admin &&
                          onCustomerStatusUpdate &&
                          order?.status.toLowerCase() === "shipped" && (
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Confirm that you received this order?",
                                  )
                                ) {
                                  onCustomerStatusUpdate(order._id, "received");
                                }
                              }}
                              className="whitespace-nowrap rounded-full bg-black px-3 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800"
                            >
                              Mark received
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <div>NO orders</div>
            )}
          </table>
        </div>
        {rows && (
          <TablePagination
            itemCount={orderRows.length}
            page={orderPagination.page}
            pageCount={orderPagination.pageCount}
            onPageChange={orderPagination.setPage}
          />
        )}
      </div>
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal
            key={selectedOrder._id}
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {statusOrder && (
          <Modal
            key={statusOrder._id}
            eyebrow="Order management"
            title={`Update ${statusOrder._id}`}
            onClose={() => setStatusOrder(null)}
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onStatusUpdate(statusOrder._id, nextStatus);
                setStatusOrder(null);
              }}
            >
              <p className="text-sm text-zinc-500">
                Choose the current fulfillment status for this order.
              </p>
              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-semibold text-zinc-600">
                  Order status
                </span>
                <select
                  value={nextStatus}
                  onChange={(event) => setNextStatus(event.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                >
                  {[
                    "Pending",
                    "Processing",
                    "Shipped",
                    "Delivered",
                    "Received",
                    "Cancelled",
                  ].map((status) => (
                    <option key={status.toLocaleLowerCase()}>{status}</option>
                  ))}
                </select>
              </label>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStatusOrder(null)}
                  className="flex-1 rounded-full border border-zinc-200 px-4 py-3 text-sm font-bold hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800"
                >
                  Save status
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
