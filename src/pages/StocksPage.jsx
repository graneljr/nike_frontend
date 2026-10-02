import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faBox,
  faBoxesStacked,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  MetricCard,
  Modal,
  PageHeading,
} from "../components/dashboard/DashboardUI";
import api from "@/middleware/apiMiddleware";
import { toast } from "sonner";

const money = (amount) => `₱${Number(amount).toLocaleString()}`;
function StockDetailsModal({ item, onClose, onUpdateQuantity, onAddSize }) {
  const [quantity, setQuantity] = useState(item?.quantity ?? 0);
  const [newSize, setNewSize] = useState("");
  const [newSizePrice, setNewSizePrice] = useState("");
  const [newSizeQuantity, setNewSizeQuantity] = useState("");
  const [isAddingSize, setIsAddingSize] = useState(false);
  useEffect(
    () => setQuantity(item?.quantity ?? 0),
    [item?._id, item?.quantity],
  );
  if (!item) return null;

  const details = [
    ["Category", item.category],
    ["Price", money(item.price)],
    [
      "Available pairs",
      item.size.reduce((total, entry) => total + entry.quantity, 0),
    ],
  ];
  const sizes = item.size || [];

  const handleAddSize = async (event) => {
    event.preventDefault();
    setIsAddingSize(true);
    const added = await onAddSize(item._id, {
      size: newSize,
      price: Number(newSizePrice),
      quantity: Number(newSizeQuantity),
    });
    setIsAddingSize(false);
    if (added) {
      setNewSize("");
      setNewSizePrice("");
      setNewSizeQuantity("");
    }
  };

  return (
    <Modal eyebrow="Inventory details" title={item.name} onClose={onClose}>
      <div className="overflow-hidden rounded-xl bg-zinc-100">
        <img
          src={item.image}
          alt={item.name}
          className="aspect-[16/9] w-full object-cover mix-blend-multiply"
        />
      </div>
      <p className="mt-4 text-sm leading-6 text-zinc-600">
        {item.description ||
          "A Nike shoe built for comfort, movement, and everyday performance."}
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-3">
        {details.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-zinc-50 p-3">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {label}
            </dt>
            <dd className="mt-1 text-sm font-bold">{value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-5 rounded-xl border border-zinc-200 p-4">
        <h3 className="text-sm font-bold">Sizes and prices</h3>
        {sizes.length > 0 ? (
          <div className="mt-3 divide-y divide-zinc-100">
            {sizes.map((entry) => (
              <div
                key={entry._id || entry.size}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="font-semibold">{entry.size}</span>
                <span className="text-zinc-600">
                  {money(entry.price)} · {entry.quantity} pairs
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-zinc-500">
            No saved size options for this item.
          </p>
        )}

        <form
          onSubmit={handleAddSize}
          className="mt-4 border-t border-zinc-100 pt-4"
        >
          <p className="mb-3 text-xs font-semibold text-zinc-600">
            Add a size option
          </p>
          <div className="grid grid-cols-3 gap-2">
            <input
              aria-label="New size"
              value={newSize}
              onChange={(event) => setNewSize(event.target.value)}
              placeholder="US 10"
              required
              className="min-w-0 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black"
            />
            <input
              aria-label="Price for new size"
              type="number"
              min="0"
              step="0.01"
              value={newSizePrice}
              onChange={(event) => setNewSizePrice(event.target.value)}
              placeholder="Price"
              required
              className="min-w-0 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black"
            />
            <input
              aria-label="Quantity for new size"
              type="number"
              min="0"
              step="1"
              value={newSizeQuantity}
              onChange={(event) => setNewSizeQuantity(event.target.value)}
              placeholder="Pairs"
              required
              className="min-w-0 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>
          <button
            type="submit"
            disabled={isAddingSize}
            className="mt-3 w-full rounded-full bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {isAddingSize ? "Adding…" : "Add size"}
          </button>
        </form>
      </section>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onUpdateQuantity(item.id, Math.max(0, Number(quantity)));
          onClose();
        }}
        className="mt-5 rounded-xl border border-zinc-200 p-4"
      >
        <label htmlFor="stock-quantity" className="block text-sm font-bold">
          Update quantity
        </label>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          Set the number of pairs currently available for this product.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            id="stock-quantity"
            type="number"
            min="0"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
          <button
            type="submit"
            className="rounded-full bg-black px-4 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-800"
          >
            Save quantity
          </button>
        </div>
      </form>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-full border border-zinc-200 px-5 py-3 text-sm font-bold transition hover:bg-zinc-50"
      >
        Close
      </button>
    </Modal>
  );
}

function AddStockModal({ onClose }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sizes, setSizes] = useState([{ size: "", price: "", quantity: "" }]);

  useEffect(
    () => () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    },
    [imagePreview],
  );

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedImage) {
      toast.error("Choose a product image before adding stock.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);
      formData.set("image", selectedImage);
      formData.set(
        "sizes",
        JSON.stringify(
          sizes.map((entry) => ({
            size: entry.size,
            price: Number(entry.price),
            quantity: Number(entry.quantity),
          })),
        ),
      );
      const response = await api.post("/products/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message || "Product added successfully");
      onClose(response.data.product);
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to add product. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Product name",
      placeholder: "Nike Air Max",
      required: true,
    },
    {
      name: "category",
      label: "Category",
      placeholder: "Running",
      required: true,
    },
  ];

  const updateSize = (index, key, value) => {
    setSizes((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [key]: value } : entry,
      ),
    );
  };

  return (
    <Modal
      eyebrow="Inventory management"
      title="Add new stock"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <label
              key={field.name}
              className={field.wide ? "sm:col-span-2" : ""}
            >
              <span className="mb-2 block text-xs font-semibold text-zinc-600">
                {field.label}
              </span>
              <input
                name={field.name}
                type={field.type || "text"}
                min={field.type === "number" ? "0" : undefined}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black"
              />
            </label>
          ))}
          <section className="sm:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-600">
                Sizes, prices, and quantities
              </span>
              <button
                type="button"
                onClick={() =>
                  setSizes((current) => [
                    ...current,
                    { size: "", price: "", quantity: "" },
                  ])
                }
                className="text-xs font-bold underline underline-offset-4"
              >
                Add another size
              </button>
            </div>
            <div className="space-y-3">
              {sizes.map((entry, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2"
                >
                  <input
                    aria-label={`Size ${index + 1}`}
                    value={entry.size}
                    onChange={(event) =>
                      updateSize(index, "size", event.target.value)
                    }
                    placeholder="US 9"
                    required
                    className="min-w-0 rounded-lg border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-black"
                  />
                  <input
                    aria-label={`Price for size ${index + 1}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={entry.price}
                    onChange={(event) =>
                      updateSize(index, "price", event.target.value)
                    }
                    placeholder="Price (₱)"
                    required
                    className="min-w-0 rounded-lg border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-black"
                  />
                  <input
                    aria-label={`Quantity for size ${index + 1}`}
                    type="number"
                    min="0"
                    step="1"
                    value={entry.quantity}
                    onChange={(event) =>
                      updateSize(index, "quantity", event.target.value)
                    }
                    placeholder="Pairs"
                    required
                    className="min-w-0 rounded-lg border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    disabled={sizes.length === 1}
                    onClick={() =>
                      setSizes((current) =>
                        current.filter((_, entryIndex) => entryIndex !== index),
                      )
                    }
                    aria-label={`Remove size ${index + 1}`}
                    className="px-2 text-sm font-bold text-zinc-500 disabled:opacity-30"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-xs font-semibold text-zinc-600">
              Product image
            </span>
            <input
              name="image"
              type="file"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-xs file:font-bold"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Selected product preview"
                className="mt-3 h-32 w-full rounded-lg object-cover"
              />
            )}
          </label>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-xs font-semibold text-zinc-600">
              Description
            </span>
            <textarea
              name="description"
              rows="3"
              placeholder="Describe the shoe..."
              className="w-full resize-y rounded-lg border border-zinc-200 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black"
            />
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-zinc-200 px-4 py-3 text-sm font-bold hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Uploading…" : "Add stock"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function StocksPage() {
  const [stockItems, setStockItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setStockItems(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const totalPairs = stockItems.reduce(
    (total, item) =>
      total + item.size.reduce((sum, entry) => sum + entry.quantity, 0),
    0,
  );
  const lowStockCount = stockItems.filter(
    (item) => item.size.reduce((sum, entry) => sum + entry.quantity, 0) <= 12,
  ).length;

  const updateQuantity = (id, quantity) => {
    setStockItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const addSize = async (id, sizeData) => {
    try {
      const response = await api.post(`/products/${id}/sizes`, sizeData);
      const product = response.data.product;
      const quantity = product.size.reduce(
        (total, entry) => total + entry.quantity,
        0,
      );
      setStockItems((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, ...product, id: product._id, quantity }
            : item,
        ),
      );
      setSelectedStock((current) =>
        current?.id === id
          ? { ...current, ...product, id: product._id, size: product.size }
          : current,
      );
      toast.success(response.data.message || "Size added successfully");
      return product;
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to add size. Please try again.",
      );
      return null;
    }
  };

  return (
    <>
      <PageHeading
        eyebrow="Store management"
        title="View stocks"
        description="Browse your sneaker inventory and keep track of available sizes and pairs."
        action={
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
          >
            <FontAwesomeIcon icon={faPlus} /> Add stock
          </button>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={faBoxesStacked}
          label="Products listed"
          value={stockItems.length}
          change="In catalog"
        />
        <MetricCard
          icon={faBox}
          label="Pairs in stock"
          value={totalPairs.toLocaleString()}
          change="All sizes"
        />
        <MetricCard
          icon={faArrowTrendUp}
          label="Low stock items"
          value={lowStockCount}
          change="12 pairs or less"
        />
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Pairs available</th>
                <th className="px-5 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {stockItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt=""
                        className="h-12 w-12 rounded-lg bg-zinc-100 object-cover mix-blend-multiply"
                      />
                      <span className="font-bold">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">{item.category}</td>
                  <td className="px-5 py-4 font-semibold">
                    {money(item.price)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        item.size.reduce(
                          (total, entry) => total + entry.quantity,
                          0,
                        ) <= 12
                          ? "font-bold text-zinc-900"
                          : "text-zinc-600"
                      }
                    >
                      {item.size.reduce(
                        (total, entry) => total + entry.quantity,
                        0,
                      )}{" "}
                      pairs
                    </span>
                    {item.size.reduce(
                      (total, entry) => total + entry.quantity,
                      0,
                    ) <= 12 && (
                      <span className="ml-2 rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-600">
                        Low
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedStock(item)}
                      className="whitespace-nowrap rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-bold transition hover:border-black hover:bg-black hover:text-white"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <AddStockModal
          onClose={(product) => {
            setIsAddModalOpen(false);
            if (product) {
              setStockItems((current) => [...current, product]);
            }
          }}
        />
      )}
      <StockDetailsModal
        item={selectedStock}
        onClose={() => setSelectedStock(null)}
        onUpdateQuantity={updateQuantity}
        onAddSize={addSize}
      />
    </>
  );
}

export default StocksPage;
