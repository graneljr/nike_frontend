import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  faArrowTrendUp,
  faBox,
  faBoxesStacked,
  faCartShopping,
  faChevronRight,
  faPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import products from "../data/products";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import SettingsPage from "./SettingsPage";
import {
  MetricCard,
  Modal,
  OrdersTable,
  PageHeading,
  Status,
} from "../components/dashboard/DashboardUI";

const initialOrders = [
  { id: "NK-2048", customer: "Jordan Lee", date: "Sep 24, 2026", items: "Air Max Solo", amount: 6595, status: "Processing" },
  { id: "NK-2047", customer: "Sam Rivera", date: "Sep 22, 2026", items: "Pegasus 41 · 2 items", amount: 13790, status: "Shipped" },
  { id: "NK-2046", customer: "Alex Morgan", date: "Sep 20, 2026", items: "Kobe A.D. Mid", amount: 8995, status: "Delivered" },
];

const members = [
  { name: "Jordan Lee", email: "jordan.lee@email.com", joined: "Sep 18, 2026", orders: 4, status: "Active" },
  { name: "Sam Rivera", email: "sam.rivera@email.com", joined: "Sep 12, 2026", orders: 7, status: "Active" },
  { name: "Alex Morgan", email: "alex.morgan@email.com", joined: "Aug 29, 2026", orders: 2, status: "Active" },
];

const money = (amount) => `₱${Number(amount).toLocaleString()}`;

function ProfilePage({ userData }) {
  const name = userData?.fullName || "Nike Member";
  return <>
    <PageHeading eyebrow="Your account" title="Profile" description="Manage your account information and preferences." />
    <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="rounded-xl bg-zinc-100 p-6"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-xl font-black text-white">{name.slice(0, 1).toUpperCase()}</div><h2 className="mt-4 text-lg font-bold">{name}</h2><p className="mt-1 text-sm text-zinc-500">{userData?.email || "member@nikestore.com"}</p><span className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-600">{userData?.role === "admin" ? "Store admin" : "Nike member"}</span></div>
      <div className="rounded-xl border border-zinc-200 p-5 sm:p-7"><h2 className="text-lg font-bold">Personal information</h2><p className="mt-1 text-sm text-zinc-500">Your details are shown here for your account.</p><div className="mt-6 grid gap-5 sm:grid-cols-2">{[["Full name", name], ["Email address", userData?.email || "member@nikestore.com"], ["Account type", userData?.role === "admin" ? "Administrator" : "Nike member"], ["Preferred store", "Nike online store"]].map(([label, value]) => <div key={label} className="border-b border-zinc-200 pb-3"><p className="text-xs text-zinc-500">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>)}</div><button className="mt-7 rounded-full bg-black px-5 py-3 text-sm font-bold text-white hover:bg-zinc-800">Edit profile</button></div>
    </div>
  </>;
}


function OrdersPage({ admin, orderRows, onStatusUpdate }) {
  return <>
    <PageHeading eyebrow={admin ? "Store management" : "Your account"} title={admin ? "All orders" : "Your orders"} description={admin ? "Review and manage recent customer orders." : "Track your purchases and revisit your order history."} />
    <div className="mt-8 flex flex-wrap gap-2">{["All orders", "Processing", "Shipped", "Delivered"].map((label, index) => <button key={label} className={`rounded-full px-4 py-2 text-xs font-semibold ${index === 0 ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>{label}</button>)}</div>
    <div className="mt-5"><OrdersTable admin={admin} rows={orderRows} onStatusUpdate={onStatusUpdate} /></div>
    {admin && <p className="mt-4 text-xs text-zinc-500">Showing 3 of 128 orders</p>}
  </>;
}

function StockDetailsModal({ item, onClose, onUpdateQuantity }) {
  const [quantity, setQuantity] = useState(item?.quantity ?? 0);
  useEffect(() => setQuantity(item?.quantity ?? 0), [item?.id, item?.quantity]);
  if (!item) return null;
  return <Modal eyebrow="Inventory details" title={item.name} onClose={onClose}>
    <div className="overflow-hidden rounded-xl bg-zinc-100"><img src={item.image} alt={item.name} className="aspect-[16/9] w-full object-cover mix-blend-multiply" /></div>
    <p className="mt-4 text-sm leading-6 text-zinc-600">{item.description || "A Nike shoe built for comfort, movement, and everyday performance."}</p>
    <div className="mt-5 grid grid-cols-2 gap-3">{[["Category", item.category], ["SKU", item.sku], ["Price", money(item.price)], ["Available pairs", item.quantity]].map(([label, value]) => <div key={label} className="rounded-lg bg-zinc-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p><p className="mt-1 text-sm font-bold">{value}</p></div>)}</div>
    <form onSubmit={(event) => { event.preventDefault(); onUpdateQuantity(item.id, Math.max(0, Number(quantity))); onClose(); }} className="mt-5 rounded-xl border border-zinc-200 p-4">
      <label htmlFor="stock-quantity" className="block text-sm font-bold">Update quantity</label>
      <p className="mt-1 text-xs leading-5 text-zinc-500">Set the number of pairs currently available for this product.</p>
      <div className="mt-3 flex gap-2"><input id="stock-quantity" type="number" min="0" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-black" /><button type="submit" className="rounded-full bg-black px-4 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-800">Save quantity</button></div>
    </form>
    <button type="button" onClick={onClose} className="mt-6 w-full rounded-full border border-zinc-200 px-5 py-3 text-sm font-bold transition hover:bg-zinc-50">Close</button>
  </Modal>;
}

function AddStockModal({ onClose, onAdd }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    onAdd({
      ...values,
      price: Number(values.price),
      quantity: Number(values.quantity),
      image: values.image || "/products/hero-shoe.png",
    });
    onClose();
  };
  const fields = [
    { name: "name", label: "Product name", placeholder: "Nike Air Max", required: true },
    { name: "category", label: "Category", placeholder: "Running", required: true },
    { name: "price", label: "Price (₱)", placeholder: "0", type: "number", required: true },
    { name: "quantity", label: "Quantity", placeholder: "0", type: "number", required: true },
    { name: "image", label: "Image URL", placeholder: "https://...", wide: true },
  ];
  return <Modal eyebrow="Inventory management" title="Add new stock" onClose={onClose}>
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">{fields.map((field) => <label key={field.name} className={field.wide ? "sm:col-span-2" : ""}><span className="mb-2 block text-xs font-semibold text-zinc-600">{field.label}</span><input name={field.name} type={field.type || "text"} min={field.type === "number" ? "0" : undefined} required={field.required} placeholder={field.placeholder} className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black" /></label>)}
        <label className="sm:col-span-2"><span className="mb-2 block text-xs font-semibold text-zinc-600">Description</span><textarea name="description" rows="3" placeholder="Describe the shoe..." className="w-full resize-y rounded-lg border border-zinc-200 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black" /></label>
      </div>
      <div className="mt-6 flex gap-3"><button type="button" onClick={onClose} className="flex-1 rounded-full border border-zinc-200 px-4 py-3 text-sm font-bold hover:bg-zinc-50">Cancel</button><button type="submit" className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800">Add stock</button></div>
    </form>
  </Modal>;
}

function StockPage() {
  const [stockItems, setStockItems] = useState(() => products.map((product, index) => ({
    ...product,
    sku: `NK-${String(product.id).padStart(4, "0")}`,
    quantity: [8, 12, 17, 24, 31, 15, 28, 19, 22][index] || 12,
  })));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const totalPairs = stockItems.reduce((total, item) => total + Number(item.quantity), 0);
  const lowStock = stockItems.filter((item) => item.quantity <= 12).length;

  return <>
    <PageHeading eyebrow="Store management" title="View stocks" description="Browse your sneaker inventory and keep track of available sizes and pairs." action={<button type="button" onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"><FontAwesomeIcon icon={faPlus} /> Add stock</button>} />
    <div className="mt-8 grid gap-4 sm:grid-cols-3"><MetricCard icon={faBoxesStacked} label="Products listed" value={stockItems.length} change="In catalog" /><MetricCard icon={faBox} label="Pairs in stock" value={totalPairs.toLocaleString()} change="All sizes" /><MetricCard icon={faArrowTrendUp} label="Low stock items" value={lowStock} change="12 pairs or less" /></div>
    <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-zinc-500"><tr><th className="px-5 py-4">Product</th><th className="px-5 py-4">SKU</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Pairs available</th><th className="px-5 py-4"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-zinc-100">{stockItems.map((item) => <tr key={item.id}><td className="px-5 py-3"><div className="flex items-center gap-3"><img src={item.image} alt="" className="h-12 w-12 rounded-lg bg-zinc-100 object-cover mix-blend-multiply" /><span className="font-bold">{item.name}</span></div></td><td className="px-5 py-4 text-zinc-500">{item.sku}</td><td className="px-5 py-4">{item.category}</td><td className="px-5 py-4 font-semibold">{money(Number(item.price))}</td><td className="px-5 py-4"><span className={item.quantity <= 12 ? "font-bold text-zinc-900" : "text-zinc-600"}>{item.quantity} pairs</span>{item.quantity <= 12 && <span className="ml-2 rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-600">Low</span>}</td><td className="px-5 py-4 text-right"><button type="button" onClick={() => setSelectedStock(item)} className="whitespace-nowrap rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-bold transition hover:border-black hover:bg-black hover:text-white">Details</button></td></tr>)}</tbody></table></div></div>
    {isAddModalOpen && <AddStockModal onClose={() => setIsAddModalOpen(false)} onAdd={(newStock) => setStockItems((current) => [newStock, ...current])} />}
    <StockDetailsModal item={selectedStock} onClose={() => setSelectedStock(null)} onUpdateQuantity={(id, quantity) => setStockItems((current) => current.map((item) => item.id === id ? { ...item, quantity } : item))} />
  </>;
}

function UsersPage() {
  const [selectedMember, setSelectedMember] = useState(null);
  return <>
    <PageHeading eyebrow="Store management" title="Customers" description="Your Nike store community and their recent activity." />
    <div className="mt-8 grid gap-4 sm:grid-cols-3"><MetricCard icon={faUsers} label="Total customers" value="1,204" change="6.2%" /><MetricCard icon={faCartShopping} label="New this month" value="86" change="10.1%" /><MetricCard icon={faBox} label="Orders placed" value="3,418" change="4.8%" /></div>
    <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200"><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-zinc-500"><tr><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Joined</th><th className="px-5 py-4">Orders</th><th className="px-5 py-4">Status</th><th className="px-5 py-4"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-zinc-100">{members.map((member) => <tr key={member.email}><td className="px-5 py-4"><p className="font-bold">{member.name}</p><p className="mt-1 text-xs text-zinc-500">{member.email}</p></td><td className="px-5 py-4 text-zinc-500">{member.joined}</td><td className="px-5 py-4">{member.orders}</td><td className="px-5 py-4"><Status>{member.status}</Status></td><td className="px-5 py-4 text-right"><button type="button" aria-label={`View ${member.name}`} onClick={() => setSelectedMember(member)} className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-black"><FontAwesomeIcon icon={faChevronRight} /></button></td></tr>)}</tbody></table></div></div>
    {selectedMember && <Modal eyebrow="Customer details" title={selectedMember.name} onClose={() => setSelectedMember(null)}><div className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 px-4"><div className="py-4"><p className="text-xs text-zinc-500">Email address</p><p className="mt-1 text-sm font-semibold">{selectedMember.email}</p></div><div className="flex justify-between gap-4 py-4"><div><p className="text-xs text-zinc-500">Member since</p><p className="mt-1 text-sm font-semibold">{selectedMember.joined}</p></div><div className="text-right"><p className="text-xs text-zinc-500">Orders placed</p><p className="mt-1 text-sm font-semibold">{selectedMember.orders}</p></div></div><div className="flex items-center justify-between py-4"><p className="text-xs text-zinc-500">Account status</p><Status>{selectedMember.status}</Status></div></div><button type="button" onClick={() => setSelectedMember(null)} className="mt-6 w-full rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800">Close</button></Modal>}
  </>;
}

function Dashboard({ userData }) {
  const { pathname } = useLocation();
  const isAdmin = userData?.role === "admin";
  const [orderRows, setOrderRows] = useState(initialOrders);
  const updateOrderStatus = (orderId, status) => {
    setOrderRows((current) => current.map((order) => order.id === orderId ? { ...order, status } : order));
  };

  let content;
  if (pathname === "/profile") content = <ProfilePage userData={userData} />;
  else if (pathname === "/settings") content = <SettingsPage />;
  else if (pathname === "/orders" || pathname === "/view_orders") content = <OrdersPage admin={isAdmin} orderRows={orderRows} onStatusUpdate={updateOrderStatus} />;
  else if (pathname === "/stocks") content = <StockPage />;
  else if (pathname === "/users") content = <UsersPage />;
  else content = isAdmin
    ? <AdminDashboard orderRows={orderRows} onStatusUpdate={updateOrderStatus} />
    : <UserDashboard userData={userData} orderRows={orderRows} />;

  return <div className="min-h-[calc(100vh-130px)] px-5 py-7 sm:px-8 sm:py-9 xl:px-12"><div className="mx-auto max-w-7xl">{content}<footer className="mt-14 border-t border-zinc-200 pt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Nike Store · Member and store dashboard</footer></div></div>;
}

export default Dashboard;
