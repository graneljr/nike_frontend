import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import api from "@/middleware/apiMiddleware";

const emptyForm = { address: "", instructions: "" };
const paymentMethods = [
  {
    id: "cod",
    title: "Cash on delivery",
    description: "Pay when your order arrives",
    icon: faMoneyBillWave,
  },
  {
    id: "online",
    title: "Online payment",
    description: "Choose a digital payment method",
    icon: faCreditCard,
  },
];

function CheckoutForm({ cart }) {
  const cartIsEmpty = cart.length === 0;
  const [payment, setPayment] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange (event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setMessage("");
  }

const  handleSubmit =  async (event) => {
    event.preventDefault();

    if (cartIsEmpty) {
      setIsSuccess(false);
      setMessage("Add a product to your cart before checkout.");
    } else if (!form.address.trim()) {
      setIsSuccess(false);
      setMessage("Enter a delivery address to continue.");
    } else {
      setIsSuccess(true);
      const selectedMethod = paymentMethods.find((method) => method.id === paymentMethod)?.title;
      setMessage(`Details validated. ${selectedMethod} selected; no order was placed.`);
    }
    const orderDetails = cart.map((item) => { return { productId: item._id, quantity: item.quantity, size: item.size}; });

    const ordernow = await api.post("/orders", {
      orderDetails: orderDetails,
      paymentMethod: paymentMethod 
    });
    console.log("Order placed successfully. Order ID:", ordernow.data);
    if(paymentMethod === "online") {
      const paymentData = await api.post("/payment/process_payment", {
        orderId: ordernow.data.orderId,
      });
      setPayment(paymentData.data);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 border-t border-zinc-200 pt-7" noValidate>
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-bold text-white">1</span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Delivery</p>
          <h2 className="mt-0.5 text-lg font-bold tracking-tight">Where should we send it?</h2>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-zinc-700">Delivery address <span className="text-zinc-400">· required</span></span>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="House or unit, street, barangay, city, postal code"
            autoComplete="street-address"
            rows="4"
            required
            aria-label="Delivery address"
            className="w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black focus:ring-2 focus:ring-black/5"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-zinc-700">Delivery instructions <span className="font-normal text-zinc-400">· optional</span></span>
          <input
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            placeholder="Gate code, landmark, or notes"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black focus:ring-2 focus:ring-black/5"
          />
        </label>
      </div>

      <fieldset className="mt-7 border-t border-zinc-200 pt-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-700">2</span>
          <div>
            <legend className="text-sm font-bold">Payment method</legend>
            <p className="mt-0.5 text-xs text-zinc-500">Select your preferred option.</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {paymentMethods.map((method) => {
            const isSelected = paymentMethod === method.id;
            return (
              <label
                key={method.id}
                className={`relative flex cursor-pointer flex-col items-start gap-3 rounded-xl border p-3.5 transition ${
                  isSelected ? "border-black bg-white ring-1 ring-black" : "border-zinc-200 bg-white hover:border-zinc-400"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => {
                    setPaymentMethod(method.id);
                    setMessage("");
                  }}
                  className="absolute right-3 top-3 h-4 w-4 accent-black"
                />
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700" aria-hidden="true">
                  <FontAwesomeIcon icon={method.icon} />
                </span>
                <span className="min-w-0 pr-4">
                  <span className="block text-sm font-semibold">{method.title}</span>
                  <span className="mt-1 block text-[11px] leading-4 text-zinc-500">{method.description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {message && (
        <p className={`mt-4 rounded-lg px-3.5 py-3 text-sm ${isSuccess ? "bg-zinc-100 text-zinc-700" : "bg-red-50 text-red-700"}`} role="status">
          {message}
        </p>
      )}
      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-black py-4 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      >
       {
        paymentMethod === "online" ? "Proceed to payment" : "Place order"
       }
      </button>
      <p className="mt-3 text-center text-[11px] leading-5 text-zinc-500">
        Checkout is a preview and does not place orders or collect payments yet.
      </p>
      {
        payment && (
         <div className="absolute inset-0 z-[999] flex items-center justify-center bg-black/50">
           <div className="mt-4 rounded-lg bg-zinc-100 p-4 text-sm text-zinc-700">
            <p>Payment QR Code:</p>
            <img src={payment.qrCode} alt="Payment QR Code" className="mt-2 w-32 h-32" />
            <p className="mt-2">Amount: ₱{payment.amount.toLocaleString()}</p>
          </div>
         </div>
        )
      }
    </form>
  );
}

export default CheckoutForm;
