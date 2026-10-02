import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import CheckoutForm from "../components/CheckoutForm";

function Cart({ cart, updateQuantity, removeFromCart }) {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <section className="mx-auto min-h-[70vh] max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="text-sm font-bold  uppercase tracking-widest text-zinc-500">Your selection</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">Cart</h1>
      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          {cart.length === 0 ? (
            <div className="border-y border-zinc-200 py-20 text-center">
              <p className="text-xl font-semibold">Your cart is empty.</p>
              <Link to="/shop" className="mt-5 inline-block rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800">Shop shoes</Link>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={`${item.id}-${item.size}`}
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))
          )}
        </div>

        <aside className="h-fit bg-zinc-100 p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Order summary</h2>
          <div className="mt-6 space-y-4 border-b border-zinc-300 pb-5 text-sm">
            <div className="flex justify-between"><span className="text-zinc-600">Total items</span><span>{totalItems}</span></div>
            <div className="flex justify-between"><span className="text-zinc-600">Subtotal</span><span>₱{subtotal.toLocaleString()}</span></div>
          </div>
          <div className="flex justify-between pt-5 font-bold"><span>Total</span><span>₱{subtotal.toLocaleString()}</span></div>
          <CheckoutForm cart={cart} />
        </aside>
      </div>
    </section>
  );
}

export default Cart;
