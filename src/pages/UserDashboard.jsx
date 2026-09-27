import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBox, faCartShopping, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import products from "../data/products";
import { MetricCard, OrdersTable, PageHeading, SectionTitle } from "../components/dashboard/DashboardUI";

const money = (amount) => `₱${Number(amount).toLocaleString()}`;

function UserDashboard({ userData, orderRows }) {
  const name = userData?.fullName?.split(" ")[0] || "there";
  return (
    <>
      <PageHeading eyebrow="Member dashboard" title={`Welcome back, ${name}.`} description="Your Nike orders and account, all in one place." action={<Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800">Shop new arrivals <FontAwesomeIcon icon={faArrowRight} /></Link>} />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={faCartShopping} label="Total orders" value="04" change="2 this month" />
        <MetricCard icon={faBox} label="On the way" value="01" change="Arriving soon" />
        <MetricCard icon={faUsers} label="Member since" value="2024" change="Nike member" />
      </div>
      <section className="mt-10">
        <SectionTitle title="Recent orders" link="View all orders" to="/orders" />
        <OrdersTable rows={orderRows.slice(0, 2)} />
      </section>
      <section className="mt-10">
        <SectionTitle title="Picked for your next move" link="Shop all" to="/shop" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => <Link to={`/product/${product.id}`} key={product.id} className="group overflow-hidden rounded-xl bg-zinc-100">
            <div className="aspect-square overflow-hidden"><img src={product.image} alt={product.name} className="h-full w-full object-cover mix-blend-multiply transition duration-300 group-hover:scale-105" /></div>
            <div className="p-3 sm:p-4"><p className="truncate text-sm font-bold">{product.name}</p><p className="mt-1 text-xs text-zinc-500">{money(product.price)}</p></div>
          </Link>)}
        </div>
      </section>
    </>
  );
}

export default UserDashboard;
