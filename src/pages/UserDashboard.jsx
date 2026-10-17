import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  faArrowRight,
  faBox,
  faCartShopping,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {
  MetricCard,
  OrdersTable,
  PageHeading,
  SectionTitle,
} from "../components/dashboard/DashboardUI";
import api from "@/middleware/apiMiddleware";
import { toast } from "sonner";

const money = (amount) => `₱${Number(amount).toLocaleString()}`;

function UserDashboard({ userData }) {
  const name = userData?.fullName?.split(" ")[0] || "there";
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    totalOrders: 0,
    onTheWay: 0,
    ordersThisMonth: 0,
    trends: {},
  });
  const [products, setProducts] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get("/orders/my-orders");
        setDashboardData((current) => ({ ...current, ...response.data }));
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load your dashboard orders.");
      } finally {
        setIsLoadingOrders(false);
      }
    };
    const loadProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load products.");
      }
    };

    loadOrders();
    loadProducts();
  }, []);

  const recentOrders = dashboardData.orders.map((order) => ({
    ...order,
    status: order.status?.charAt(0).toUpperCase() + order.status?.slice(1),
    createdAt: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString()
      : "—",
  }));
  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt).getFullYear()
    : "—";
  const updateCustomerOrderStatus = async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/my-orders/${orderId}/status`, { status });
      setDashboardData((current) => ({
        ...current,
        orders: current.orders.map((order) =>
          order._id === orderId
            ? { ...order, status: response.data.order.status }
            : order,
        ),
        onTheWay: status === "received"
          ? Math.max(0, current.onTheWay - 1)
          : current.onTheWay,
      }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update this order.");
    }
  };

  return (
    <>
      <PageHeading
        eyebrow="Member dashboard"
        title={`Welcome back, ${name}.`}
        description="Your Nike orders and account, all in one place."
        action={
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
          >
            Shop new arrivals <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        }
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={faCartShopping}
          label="Total orders"
          value={dashboardData.totalOrders.toLocaleString()}
          trend={dashboardData.trends?.totalOrders}
          change="vs last month"
        />
        <MetricCard
          icon={faBox}
          label="On the way"
          value={dashboardData.onTheWay.toLocaleString()}
          change="Shipped orders"
        />
        <MetricCard
          icon={faUsers}
          label="Member since"
          value={memberSince}
          change="Nike member"
        />
      </div>
      <section className="mt-10">
        <SectionTitle
          title="Recent orders"
          link="View all orders"
          to="/orders"
        />
        {isLoadingOrders ? (
          <div className="rounded-xl border border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500">
            Loading your orders…
          </div>
        ) : recentOrders.length ? (
          <OrdersTable
            rows={recentOrders.slice(0, 2)}
            onCustomerStatusUpdate={updateCustomerOrderStatus}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-300 px-5 py-10 text-center">
            <p className="font-semibold">No orders yet.</p>
            <p className="mt-1 text-sm text-zinc-500">Your orders will show here after checkout.</p>
            <Link to="/shop" className="mt-4 inline-flex rounded-full bg-black px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800">
              Browse the shop
            </Link>
          </div>
        )}
      </section>
      <section className="mt-10">
        <SectionTitle
          title="Picked for your next move"
          link="Shop all"
          to="/shop"
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="group overflow-hidden rounded-xl bg-zinc-100"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover mix-blend-multiply transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3 sm:p-4">
                <p className="truncate text-sm font-bold">{product.name}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {money(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default UserDashboard;
