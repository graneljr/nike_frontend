import { Outlet } from "react-router-dom";
import DashbaordSideBar from "../components/DashboardSideBar";

function DashboardLayout({userData}) {
  return (
    <div className="min-h-screen bg-white text-zinc-950 lg:flex">
      <DashbaordSideBar userData={userData}/>
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
