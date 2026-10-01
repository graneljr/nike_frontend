import {  useState } from "react";
import { Link, useParams } from "react-router-dom";
import products from "../data/products";

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8">
        <h1 className="text-3xl font-bold">Product not found.</h1>
        <Link to="/shop" className="mt-6 inline-block underline underline-offset-4">Return to shop</Link>
      </div>
    );
  }

  function handleAddToCart() {
    if (!selectedSize) {
      setMessage("Please select a size.");
      return;
    }
    addToCart(product, selectedSize, quantity);
    setMessage("Added to cart.");
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
      <Link to="/shop" className="mb-8 inline-block text-sm text-zinc-500 transition hover:text-black">← Back to shop</Link>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden bg-zinc-100">
       
            <img src={product.image} alt={product.name} className="h-full w-full object-contain p-8" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">{product.category}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-xl font-medium">₱{product.price.toLocaleString()}</p>
          <p className="mt-7 max-w-lg leading-relaxed text-zinc-600">{product.description}</p>

          <div className="mt-9">
            <p className="mb-3 font-semibold">Select size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => { setSelectedSize(size); setMessage(""); }}
                  className={`h-12 min-w-12 border px-3 transition ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-zinc-300 bg-white text-black hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 font-semibold">Quantity</p>
            <div className="inline-flex items-center border border-zinc-300">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-11 w-11 text-lg hover:bg-zinc-100">−</button>
              <span className="w-11 text-center">{quantity}</span>
              <button type="button" onClick={() => setQuantity(quantity + 1)} className="h-11 w-11 text-lg hover:bg-zinc-100">+</button>
            </div>
          </div>

          {message && (
            <p className={`mt-5 text-sm ${message === "Added to cart." ? "text-green-700" : "text-red-700"}`} role="status">
              {message}
            </p>
          )}
          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-6 w-full rounded-full bg-black py-4 font-medium text-white transition hover:bg-zinc-800"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
