import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeading } from "../components/dashboard/DashboardUI";
import api from "@/middleware/apiMiddleware";
import { formatDate } from "@/utils/DateFormatter";
import { toast } from "sonner";

const money = (amount) => `₱${Number(amount || 0).toLocaleString()}`;

function RefundStatus({ status }) {
  const refunded = status === "refunded";
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        refunded ? "bg-zinc-200 text-zinc-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      {refunded ? "Refunded" : "Pending review"}
    </span>
  );
}

function RefundsPage({ admin }) {
  const [refunds, setRefunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    let active = true;
    const loadRefunds = async () => {
      try {
        const response = await api.get("/orders/refunds");
        if (active) {
          setRefunds(Array.isArray(response.data.refunds) ? response.data.refunds : []);
        }
      } catch (error) {
        if (active) {
          toast.error(error.response?.data?.message || "Unable to load refunds.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadRefunds();
    return () => {
      active = false;
    };
  }, []);

  const approveRefund = async (refund) => {
    const amount = money(refund.refundAmount || refund.totalAmount);
    const confirmed = window.confirm(
      `Confirm that you have returned ${amount} to the customer. This will mark the order as refunded.`,
    );
    if (!confirmed) return;

    setApprovingId(refund._id);
    try {
      const response = await api.patch(`/orders/refunds/${refund._id}/approve`);
      setRefunds((current) =>
        current.map((item) =>
          item._id === refund._id ? response.data.order : item,
        ),
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to approve this refund.");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <>
      <PageHeading
        eyebrow={admin ? "Store management" : "Your account"}
        title="Refunds"
        description={
          admin
            ? "Review refund requests from customers and record completed refunds."
            : "Track refund requests for your cancelled paid orders."
        }
      />

      {admin && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm leading-6 text-zinc-600">
          This store does not transfer funds automatically. Return the money through
          the original payment method first, then approve the request to mark it as
          refunded in the order record.
        </div>
      )}

      {isLoading ? (
        <div className="mt-8 rounded-xl border border-zinc-200 px-5 py-12 text-center text-sm text-zinc-500">
          Loading refunds…
        </div>
      ) : refunds.length > 0 ? (
        <div className="mt-8 space-y-4">
          {refunds.map((refund) => {
            const isPending = refund.refundStatus === "pending";
            const refundAmount = refund.refundAmount || refund.totalAmount;
            return (
              <article
                key={refund._id}
                className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-bold">Order {refund._id}</h2>
                      <RefundStatus status={refund.refundStatus} />
                    </div>
                    {admin && (
                      <p className="mt-2 text-sm text-zinc-600">
                        {refund.userId?.fullName || "Customer"}
                        {refund.userId?.email ? ` · ${refund.userId.email}` : ""}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-zinc-500">
                      Requested {formatDate(refund.refundRequestedAt)}
                      {refund.refundProcessedAt
                        ? ` · Processed ${formatDate(refund.refundProcessedAt)}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="sm:text-right">
                      <p className="text-xs text-zinc-500">
                        {refund.refundStatus === "refunded" ? "Refunded amount" : "Refund amount"}
                      </p>
                      <p className="mt-1 text-xl font-black">{money(refundAmount)}</p>
                    </div>
                    {admin && isPending && (
                      <button
                        type="button"
                        disabled={approvingId === refund._id}
                        onClick={() => approveRefund(refund)}
                        className="rounded-full bg-black px-5 py-3 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60"
                      >
                        {approvingId === refund._id ? "Approving…" : "Approve refund"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 px-5 py-14 text-center">
          <h2 className="font-semibold">
            {admin ? "No refund requests yet." : "No refunds to show."}
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            {admin
              ? "Refund requests for paid cancelled orders will appear here."
              : "If a paid order is cancelled, its refund status will appear here."}
          </p>
          {!admin && (
            <Link
              to="/orders"
              className="mt-5 inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              View your orders
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default RefundsPage;
