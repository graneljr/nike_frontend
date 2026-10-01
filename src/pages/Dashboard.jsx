import { useState } from "react";
import { useLocation } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import OrdersPage from "./OrdersPage";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import StocksPage from "./StocksPage";
import UserDashboard from "./UserDashboard";
import UsersPage from "./UsersPage";

const initialOrders = [
  { id: "NK-2048", customer: "Jordan Lee", date: "Sep 24, 2026", items: "Air Max Solo", amount: 6595, status: "Processing" },
  { id: "NK-2047", customer: "Sam Rivera", date: "Sep 22, 2026", items: "Pegasus 41 · 2 items", amount: 13790, status: "Shipped" },
  { id: "NK-2046", customer: "Alex Morgan", date: "Sep 20, 2026", items: "Kobe A.D. Mid", amount: 8995, status: "Delivered" },
];

function Dashboard({ userData }) {
  const { pathname } = useLocation();
  const isAdmin = userData?.role === "admin";
  const [orderRows, setOrderRows] = useState(initialOrders);

  const updateOrderStatus = (orderId, status) => {
    setOrderRows((current) => current.map((order) =>
      order.id === orderId ? { ...order, status } : order,
    ));
  };

  let page;
  if (pathname === "/profile") page = <ProfilePage userData={userData} />;
  else if (pathname === "/settings") page = <SettingsPage />;
  else if (pathname === "/orders" || pathname === "/view_orders") {
    page = <OrdersPage admin={isAdmin} orderRows={orderRows} onStatusUpdate={updateOrderStatus} />;
  } else if (pathname === "/stocks") page = <StocksPage />;
  else if (pathname === "/users") page = <UsersPage />;
  else if (isAdmin) page = <AdminDashboard orderRows={orderRows} onStatusUpdate={updateOrderStatus} />;
  else page = <UserDashboard userData={userData} orderRows={orderRows} />;

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
