import { useState } from "react";

const emptyForm = { fullName: "", email: "", contact: "", address: "" };

function CheckoutForm({ cartIsEmpty }) {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const isIncomplete = Object.values(form).some((value) => value.trim() === "");
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const contactDigits = form.contact.replace(/\D/g, "");
    const hasValidContactCharacters = /^[+\d\s()-]+$/.test(form.contact.trim());
    const isContactValid =
      hasValidContactCharacters &&
      contactDigits.length >= 10 &&
      contactDigits.length <= 13;

    if (cartIsEmpty) {
      setIsSuccess(false);
      setMessage("Add a product to your cart before checkout.");
    } else if (isIncomplete) {
      setIsSuccess(false);
      setMessage("Please complete all required fields.");
    } else if (!isEmailValid) {
      setIsSuccess(false);
      setMessage("Please enter a valid email address.");
    } else if (!isContactValid) {
      setIsSuccess(false);
      setMessage("Please enter a valid contact number.");
    } else {
      setIsSuccess(true);
      setMessage("Order successfully submitted.");
      setForm(emptyForm);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 border-t border-zinc-300 pt-7" noValidate>
      <h2 className="text-xl font-bold">Checkout details</h2>
      <div className="mt-5 space-y-4">
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          aria-label="Full Name"
          className="w-full border-b border-zinc-300 bg-transparent py-3 outline-none transition focus:border-black"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          aria-label="Email"
          className="w-full border-b border-zinc-300 bg-transparent py-3 outline-none transition focus:border-black"
        />
        <input
          type="tel"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          aria-label="Contact Number"
          className="w-full border-b border-zinc-300 bg-transparent py-3 outline-none transition focus:border-black"
        />
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          aria-label="Address"
          rows="3"
          className="w-full resize-none border-b border-zinc-300 bg-transparent py-3 outline-none transition focus:border-black"
        />
      </div>
      {message && (
        <p className={`mt-4 text-sm ${isSuccess ? "text-green-700" : "text-red-700"}`} role="status">
          {message}
        </p>
      )}
      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-black py-4 font-medium text-white transition hover:bg-zinc-800"
      >
        Submit Order
      </button>
    </form>
  );
}

export default CheckoutForm;
