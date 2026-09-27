import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faBox, faBoxesStacked, faCartShopping, faEye, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import products from "../data/products";
import { MetricCard, OrdersTable, PageHeading, SectionTitle } from "../components/dashboard/DashboardUI";

function AdminDashboard({ orderRows, onStatusUpdate }) {
  return (
    <>
      <PageHeading eyebrow="Store overview" title="Your store, at a glance." description="A quick look at today's orders, customers, and inventory." action={<Link to="/stocks" className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"><FontAwesomeIcon icon={faEye} /> View stocks</Link>} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={faCartShopping} label="Orders this month" value="128" change="12.8%" />
        <MetricCard icon={faBoxesStacked} label="Products in stock" value="246" change="8.4%" />
        <MetricCard icon={faUsers} label="Registered users" value="1,204" change="6.2%" />
        <MetricCard icon={faArrowTrendUp} label="Sales this month" value="₱842k" change="14.6%" />
      </div>
      <section className="mt-10">
        <SectionTitle title="Latest orders" link="View all orders" to="/view_orders" />
        <OrdersTable admin rows={orderRows.slice(0, 3)} onStatusUpdate={onStatusUpdate} />
      </section>
      <section className="mt-10">
        <SectionTitle title="Stock to keep an eye on" link="View all stock" to="/stocks" />
        <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 px-5">
          {products.slice(0, 3).map((product, index) => <div key={product.id} className="flex items-center gap-4 py-3">
            <img src={product.image} alt="" className="h-14 w-14 rounded-lg bg-zinc-100 object-cover mix-blend-multiply" />
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{product.name}</p><p className="mt-1 text-xs text-zinc-500">{product.category}</p></div>
            <div className="text-right"><p className="text-sm font-bold">{index === 0 ? "08" : index === 1 ? "12" : "17"} pairs</p><p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-500">Low stock</p></div>
            <FontAwesomeIcon icon={faBox} className="hidden text-zinc-400 sm:block" />
          </div>)}
        </div>
      </section>
    </>
  );
}

export default AdminDashboard;
