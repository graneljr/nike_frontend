function CartItem({ item, updateQuantity, removeFromCart, setItemSelected }) {
  const variant = (item.sizes || item.sizeOptions || []).find(
    (option) => String(option.label ?? option.size) === String(item.size),
  );
  const maxQuantity = variant?.quantity == null ? null : Number(variant.quantity);

  return (
    <div className="flex gap-3 border-b border-zinc-200 py-6 sm:gap-6">
      <label className="flex shrink-0 items-start pt-2" aria-label={`Select ${item.name} for checkout`}>
        <input
          type="checkbox"
          checked={item.selected !== false}
          onChange={(event) => setItemSelected(item.id, item.size, event.target.checked)}
          className="h-5 w-5 cursor-pointer accent-black"
        />
      </label>
      <div className="h-28 w-28 shrink-0 bg-zinc-100 sm:h-36 sm:w-36">
        <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="shrink-0 font-medium">₱{(item.price * item.quantity).toLocaleString()}</p>
          </div>
          <p className="mt-1 text-sm text-zinc-500">Size {item.size}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center border border-zinc-300">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.size, -1)}
              className="h-9 w-9 text-lg transition hover:bg-zinc-100"
              aria-label={`Decrease ${item.name} quantity`}
            >−</button>
            <span className="w-9 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.size, 1)}
              disabled={maxQuantity !== null && item.quantity >= maxQuantity}
              className="h-9 w-9 text-lg transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Increase ${item.name} quantity`}
            >+</button>
          </div>
          {maxQuantity !== null && item.quantity >= maxQuantity && (
            <span className="text-xs text-zinc-500">Maximum available quantity</span>
          )}
          <button
            type="button"
            onClick={() => removeFromCart(item.id, item.size)}
            className="text-sm text-zinc-500 underline underline-offset-4 transition hover:text-black"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
