import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faBox,
  faBoxesStacked,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import products from "../data/products";
import {
  MetricCard,
  Modal,
  PageHeading,
} from "../components/dashboard/DashboardUI";
import api from "@/middleware/apiMiddleware";
import { toast } from "sonner";

const money = (amount) => `₱${Number(amount).toLocaleString()}`;
const startingQuantities = [8, 12, 17, 24, 31, 15, 28, 19, 22];

function StockDetailsModal({ item, onClose, onUpdateQuantity }) {
  const [quantity, setQuantity] = useState(item?.quantity ?? 0);
  useEffect(() => setQuantity(item?.quantity ?? 0), [item?.id, item?.quantity]);
  if (!item) return null;

  const details = [
    ["Category", item.category],
    ["SKU", item.sku],
    ["Price", money(item.price)],
    ["Available pairs", item.quantity],
  ];

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
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.target);
      const newProduct = {
        name: formData.get("name"),
        category: formData.get("category"),
        price: Number(formData.get("price")),
        size: formData.get("size"),
        quantity: Number(formData.get("quantity")),
        image: formData.get("image"),
        description: formData.get("description"),
      };
      const response = await api.post("/products/add", newProduct);
      toast.success(response.data.message || "Product added successfully");

      onClose();
    } catch (error) {
      toast.error("Failed to add product. Please try again.");
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
    {
      name: "price",
      label: "Price (₱)",
      placeholder: "0",
      type: "number",
      required: true,
    },
    {
      name: "quantity",
      label: "Quantity",
      placeholder: "0",
      type: "number",
      required: true,
    },
     {
      name: "size",
      label: "Size",
      placeholder: "US 9",
      required: true,
    },
    {
      name: "image",
      label: "Image URL",
      placeholder: "https://...",
      wide: true,
    },
  ];

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
            className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800"
          >
            Add stock
          </button>
        </div>
      </form>
    </Modal>
  );
}

function StocksPage() {
  const [stockItems, setStockItems] = useState(() =>
    products.map((product, index) => ({
      ...product,
      sku: `NK-${String(product.id).padStart(4, "0")}`,
      quantity: startingQuantities[index] ?? 12,
    })),
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const totalPairs = stockItems.reduce(
    (total, item) => total + Number(item.quantity),
    0,
  );
  const lowStockCount = stockItems.filter((item) => item.quantity <= 12).length;

  const updateQuantity = (id, quantity) => {
    setStockItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const [addProductData, setAddProductData] = useState({
    name: "",
    price: 0,
    description: "",
    size: [],
  });
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
                <th className="px-5 py-4">SKU</th>
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
                  <td className="px-5 py-4 text-zinc-500">{item.sku}</td>
                  <td className="px-5 py-4">{item.category}</td>
                  <td className="px-5 py-4 font-semibold">
                    {money(item.price)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        item.quantity <= 12
                          ? "font-bold text-zinc-900"
                          : "text-zinc-600"
                      }
                    >
                      {item.quantity} pairs
                    </span>
                    {item.quantity <= 12 && (
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
          onClose={() => setIsAddModalOpen(false)}
          addProductData={addProductData}
          onAdd={(addProductData) =>
            setAddProductData((current) => [addProductData, ...current])
          }
        />
      )}
      <StockDetailsModal
        item={selectedStock}
        onClose={() => setSelectedStock(null)}
        onUpdateQuantity={updateQuantity}
      />
    </>
  );
}

export default StocksPage;
