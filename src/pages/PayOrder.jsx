import api from "@/middleware/apiMiddleware";
import socket from "@/socket";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const PayOrder = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const getOrderById = async () => {
      try {
        const order = await api.get(`/orders/${orderId}`);
        setOrderData(order.data);
      } catch (error) {
        toast.error(error.data.message);
      }
    };

    getOrderById();

    socket.emit("join-order", orderId);

    const handlePaymentSuccess = (data) => {
      if (data.orderId === orderId) {
        toast.success("Payment Successful!");

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    };

    socket.on("payment-success", handlePaymentSuccess);

    return () => {
      socket.off("payment-success", handlePaymentSuccess);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const pay = await api.patch("/payment/pay", {
        orderId: orderData?._id,
      });

      toast.success(pay.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-5 py-12">
      <section className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-6 sm:px-8">
          <Link
            to="/cart"
            className="text-xs font-medium text-zinc-500 transition hover:text-black"
          >
            ← Back to cart
          </Link>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            Secure checkout
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight">
            Pay for your order
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Enter the amount you want to submit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8" noValidate>
          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Order reference
            </p>
            <p className="mt-1 break-all font-mono text-sm font-semibold text-zinc-800">
              {orderId}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Payable Amount
            </p>
            <p className="mt-1 break-all font-mono text-sm font-semibold text-zinc-800">
              {orderData?.totalAmount}
            </p>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-black py-4 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Pay
          </button>
          <p className="mt-4 text-center text-[11px] leading-5 text-zinc-500">
            This payment page is a preview. Submitting an amount will not charge
            or record a payment.
          </p>
        </form>
      </section>
    </main>
  );
};

export default PayOrder;
