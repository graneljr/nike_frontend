import { faHouse, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRightFromBracket,
  faBoxOpen,
  faBoxesStacked,
  faCartShopping,
  faUsers,
  faCog,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import api from "../middleware/apiMiddleware";
import { toast } from "sonner";
const userNav = [
  { icon: faHouse, label: "Dashboard", url: "/dashboard" },
    { icon: faCog, label: "Settings", url: "/settings" },
  { icon: faUser, label: "Profile", url: "/profile" },
  { icon: faCartShopping, label: "Orders", url: "/orders" },
  { icon: faHouse, label: "Home", url: "/" },
];

const adminNav = [
  { icon: faHouse, label: "Dashboard", url: "/dashboard" },
  { icon: faUser, label: "Profile", url: "/profile" },
  { icon: faCog, label: "Settings", url: "/settings" },
  { icon: faCartShopping, label: "View Orders", url: "/view_orders" },
  { icon: faBoxesStacked, label: "View Stocks", url: "/stocks" },
  { icon: faUsers, label: "Users", url: "/users" },
   { icon: faHouse, label: "Home", url: "/" },
];
const Logout = async () => {
  try {
    const logoutConfirm = confirm("Are you sure you want to logout?");
    if (logoutConfirm) {
      await api.post("/auth/logout");
    }else{
      return;
    }
    toast.success("You have been logged out.");
    window.setTimeout(() => {
      window.location.href = "/";
    }, 1200);
  } catch (error) {
    toast.error(error.response?.data?.message || "Unable to log out. Please try again.");
  }
};
function DashboardSideBar({ userData, isOpen = false, onClose = () => {} }) {
  const isAdmin = userData?.role === "admin";
  const links = isAdmin ? adminNav : userNav;
  const fullName =
    userData?.fullName || (isAdmin ? "Store Admin" : "Nike Member");
  const email =
    userData?.email ||
    (isAdmin ? "admin@nikestore.com" : "member@nikestore.com");
  const initials = fullName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const linkClass = ({ isActive }) =>
    `flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-black text-white"
        : "text-zinc-600 hover:bg-zinc-200 hover:text-black"
    }`;

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close dashboard navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
        />
      )}
      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-72 max-w-[85vw] flex-col border-r border-zinc-200 bg-zinc-50 shadow-xl transition-all duration-200 ease-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:shadow-none ${
          isOpen
            ? "visible translate-x-0"
            : "invisible -translate-x-full lg:visible"
        }`}
      >
      <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:px-5 lg:py-7">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-black text-white">
            {initials}
          </span>
          <div className="min-w-0 lg:py-0.5">
            <p className="truncate text-sm font-bold text-zinc-950">
              {fullName}
            </p>
            <p className="truncate text-xs text-zinc-500">{email}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close dashboard navigation"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-200 hover:text-black lg:hidden"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <span className="hidden rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 ring-1 ring-zinc-200 lg:mx-5 lg:mt-[-1rem] lg:mb-6 lg:inline-block lg:w-fit">
        {isAdmin ? "Store admin" : "Nike member"}
      </span>

      <nav
        aria-label="Dashboard navigation"
        className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-5 lg:px-3"
      >
        {links.map((nav) => (
          <NavLink
            key={nav.url}
            to={nav.url}
            end={nav.url === "/dashboard" || nav.url === "/"}
            className={linkClass}
            onClick={onClose}
          >
            <FontAwesomeIcon icon={nav.icon} className="w-4" />
            <span>{nav.label}</span>
          </NavLink>
        ))}
        <button
          onClick={() => {
            onClose();
            Logout();
          }}
          className="flex hover:bg-zinc-200 hover:text-black shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-4" />
          <span>Logout</span>
        </button>
      </nav>
      </aside>
    </>
  );
}

export default DashboardSideBar;
