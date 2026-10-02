import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "@/middleware/apiMiddleware";
import products from "../data/products";

function normalizeProduct(product) {
  const variants = Array.isArray(product.size) && product.size.length > 0
    ? product.size
    : (product.sizes || []).map((size) => ({
        size,
        price: product.price,
        quantity: null,
      }));

  return {
    ...product,
    id: String(product._id ?? product.id),
    price: Number(product.price ?? variants[0]?.price ?? 0),
    sizes: variants.map((variant) => ({
      label: String(variant.size),
      price: Number(variant.price ?? product.price ?? 0),
      quantity: variant.quantity == null ? null : Number(variant.quantity),
    })),
  };
}

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const localProduct = products.find((item) => String(item.id) === id);

    setIsLoading(true);
    setProduct(null);
    setSelectedSize("");
    setQuantity(1);
    setMessage("");

    if (localProduct) {
      setProduct(normalizeProduct(localProduct));
      setIsLoading(false);
      return () => controller.abort();
    }

    const getProductById = async () => {
      try {
        const response = await api.get(`/public/${id}`, { signal: controller.signal });
        if (!controller.signal.aborted) {
          setProduct(normalizeProduct(response.data));
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setProduct(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    getProductById();
    return () => controller.abort();
  }, [id]);

  const selectedVariant = useMemo(
    () => product?.sizes.find((variant) => variant.label === selectedSize),
    [product, selectedSize],
  );
  const maxQuantity = selectedVariant?.quantity;

  function handleAddToCart() {
    if (!selectedVariant) {
      setMessage("Please select a size.");
      return;
    }
    if (maxQuantity !== null && maxQuantity !== undefined && maxQuantity < 1) {
      setMessage("This size is out of stock.");
      return;
    }
    if (maxQuantity !== null && maxQuantity !== undefined && quantity > maxQuantity) {
      setMessage(`Only ${maxQuantity} pair${maxQuantity === 1 ? "" : "s"} available in this size.`);
      return;
    }

    addToCart(
      { ...product, price: selectedVariant.price },
      selectedVariant.label,
      quantity,
    );
    setMessage("Added to cart.");
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8" role="status">
        <p className="text-sm text-zinc-500">Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8">
        <h1 className="text-3xl font-bold">Product not found.</h1>
        <Link to="/shop" className="mt-6 inline-block underline underline-offset-4">Return to shop</Link>
      </div>
    );
  }

  const displayPrice = selectedVariant?.price ?? product.price;

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
          <p className="mt-4 text-xl font-medium">₱{displayPrice.toLocaleString()}</p>
          <p className="mt-7 max-w-lg leading-relaxed text-zinc-600">{product.description}</p>

          <div className="mt-9">
            <p className="mb-3 font-semibold">Select size</p>
            {product.sizes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((variant) => {
                  const isOutOfStock = variant.quantity !== null && variant.quantity < 1;
                  return (
                    <button
                      key={variant.label}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => {
                        setSelectedSize(variant.label);
                        setQuantity((current) => Math.min(current, variant.quantity || current));
                        setMessage("");
                      }}
                      className={`h-12 min-w-12 border px-3 transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        selectedSize === variant.label
                          ? "border-black bg-black text-white"
                          : "border-zinc-300 bg-white text-black hover:border-black"
                      }`}
                      aria-pressed={selectedSize === variant.label}
                    >
                      {variant.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No sizes are currently available.</p>
            )}
          </div>

          <div className="mt-8">
            <p className="mb-3 font-semibold">Quantity</p>
            <div className="inline-flex items-center border border-zinc-300">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="h-11 w-11 text-lg hover:bg-zinc-100"
                aria-label="Decrease quantity"
              >−</button>
              <span className="w-11 text-center" aria-live="polite">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((current) => maxQuantity == null ? current + 1 : Math.min(maxQuantity, current + 1))}
                disabled={maxQuantity != null && quantity >= maxQuantity}
                className="h-11 w-11 text-lg hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >+</button>
            </div>
            {selectedVariant?.quantity != null && (
              <p className="mt-2 text-xs text-zinc-500">{selectedVariant.quantity} pairs available in this size</p>
            )}
          </div>

          {message && (
            <p className={`mt-5 text-sm ${message === "Added to cart." ? "text-green-700" : "text-red-700"}`} role="status">
              {message}
            </p>
          )}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.sizes.length === 0}
            className="mt-6 w-full rounded-full bg-black py-4 font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
