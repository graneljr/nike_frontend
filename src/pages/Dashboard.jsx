import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import OrdersPage from "./OrdersPage";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import StocksPage from "./StocksPage";
import UserDashboard from "./UserDashboard";
import UsersPage from "./UsersPage";
import api from "@/middleware/apiMiddleware";
import { toast } from "sonner";


function Dashboard({ userData, setUserData }) {
  const { pathname } = useLocation();
  const isAdmin = userData?.role === "admin";
  const [latestOrders, setLatestOrders] = useState(null);
  useEffect(() => {
    const getLatestOrder = async () => {
      try {
        const latestOrder = await api.get("/orders/latest_orders");
        setLatestOrders(latestOrder.data);
      } catch (error) {
        toast.error(error.data.message);
      }
    };
    getLatestOrder();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const updateStatus = await api.patch("/orders/update_order", {
        _id: orderId,
        status: status.toLowerCase(),
      });
      toast.success(updateStatus.data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update order status.");
      return false;
    }
  };

  let page;
  if (pathname === "/profile") {
    page = <ProfilePage userData={userData} setUserData={setUserData} />;
  }
  else if (pathname === "/settings") page = <SettingsPage />;
  else if (pathname === "/orders" || pathname === "/view_orders") {
    page = (
      <OrdersPage
        admin={isAdmin}
        orderRows={latestOrders}
        onStatusUpdate={updateOrderStatus}
      />
    );
  } else if (pathname === "/stocks") page = <StocksPage />;
  else if (pathname === "/users") page = <UsersPage />;
  else if (isAdmin)
    page = (
      <AdminDashboard
        orderRows={latestOrders?.slice(0,4)}
        onStatusUpdate={updateOrderStatus}
      />
    );
  else page = <UserDashboard userData={userData} />;

  return (
    <div className="min-h-[calc(100vh-130px)] px-5 py-7 sm:px-8 sm:py-9 xl:px-12">
      <div className="mx-auto max-w-7xl">
        {page}
        <footer className="mt-14 border-t border-zinc-200 pt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
          Nike Store · Member and store dashboard
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
