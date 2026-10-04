import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import CheckoutForm from "../components/CheckoutForm";

function Cart({ cart, updateQuantity, removeFromCart, setItemSelected, setAllItemsSelected }) {
  const selectedCart = cart.filter((item) => item.selected !== false);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const checkoutItems = selectedCart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = selectedCart.reduce((total, item) => total + item.price * item.quantity, 0);
  const allSelected = cart.length > 0 && selectedCart.length === cart.length;
  const someSelected = selectedCart.length > 0 && !allSelected;

  return (
    <section className="min-h-full w-full px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-16rem)] w-full flex-col">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-7">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Your selection</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">Cart</h1>
        </div>
        <p className="text-sm text-zinc-500">{cart.length} {cart.length === 1 ? "item" : "items"} in your cart</p>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,440px)] lg:gap-12">
        <div className="min-w-0">
          {cart.length === 0 ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <p className="text-xl font-semibold">Your cart is empty.</p>
              <Link to="/shop" className="mt-5 inline-block rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800">Shop shoes</Link>
            </div>
          ) : (
            <>
            <div className="flex items-center justify-between border-b border-zinc-200 py-3 text-sm">
              <label className="flex cursor-pointer items-center gap-3 font-medium">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(element) => { if (element) element.indeterminate = someSelected; }}
                  onChange={(event) => setAllItemsSelected(event.target.checked)}
                  className="h-4 w-4 accent-black"
                />
                Select all for checkout
              </label>
              <span className="text-zinc-500">{selectedCart.length} selected</span>
            </div>
            {cart.map((item) => (
              <CartItem
                key={`${item.id}-${item.size}`}
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                setItemSelected={setItemSelected}
              />
            ))}
            </>
          )}
        </div>

        <aside className="h-fit border border-zinc-200 bg-zinc-50 p-6 sm:p-8 lg:sticky lg:top-8">
          <h2 className="text-2xl font-bold">Order summary</h2>
          <div className="mt-6 space-y-4 border-b border-zinc-300 pb-5 text-sm">
            <div className="flex justify-between"><span className="text-zinc-600">Total items</span><span>{totalItems}</span></div>
            <div className="flex justify-between"><span className="text-zinc-600">Items to checkout</span><span>{checkoutItems}</span></div>
            <div className="flex justify-between"><span className="text-zinc-600">Subtotal</span><span>₱{subtotal.toLocaleString()}</span></div>
          </div>
          <div className="flex justify-between pt-5 font-bold"><span>Total</span><span>₱{subtotal.toLocaleString()}</span></div>
          <CheckoutForm cart={selectedCart} />
        </aside>
      </div>
      </div>
    </section>
  );
}

export default Cart;
