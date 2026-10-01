import { faHouse, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRightFromBracket,
  faBoxOpen,
  faBoxesStacked,
  faCartShopping,
  faUsers,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import api from "../middleware/apiMiddleware";
const userNav = [
  { icon: faHouse, label: "Dashboard", url: "/dashboard" },
    { icon: faCog, label: "Settings", url: "/settings" },
  { icon: faUser, label: "Profile", url: "/profile" },
  { icon: faCartShopping, label: "Orders", url: "/orders" },
];

const adminNav = [
  { icon: faHouse, label: "Dashboard", url: "/dashboard" },
  { icon: faUser, label: "Profile", url: "/profile" },
  { icon: faCog, label: "Settings", url: "/settings" },
  { icon: faCartShopping, label: "View Orders", url: "/view_orders" },
  { icon: faBoxesStacked, label: "View Stocks", url: "/stocks" },
  { icon: faUsers, label: "Users", url: "/users" },
];
const Logout = async () => {
  try {
    const logoutConfirm = confirm("Are you sure you want to logout?");
    if (logoutConfirm) {
      await api.post("/auth/logout");
    }else{
      return;
    }
    window.location.href = "/";
  } catch (error) {}
};
function DashboardSideBar({ userData }) {
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
    <aside className="border-b border-zinc-200 bg-zinc-50 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
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
        <span className="hidden rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 ring-1 ring-zinc-200 lg:mt-5 lg:inline-block">
          {isAdmin ? "Store admin" : "Nike member"}
        </span>
      </div>

      <nav
        aria-label="Dashboard navigation"
        className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0"
      >
        {links.map((nav) => (
          <NavLink
            key={nav.url}
            to={nav.url}
            end={nav.url === "/dashboard"}
            className={linkClass}
          >
            <FontAwesomeIcon icon={nav.icon} className="w-4" />
            <span>{nav.label}</span>
          </NavLink>
        ))}
        <button
          onClick={Logout}
          className="flex hover:bg-zinc-200 hover:text-black shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-4" />
          <span>Logout</span>
        </button>
      </nav>
      <div className="mx-5 mt-8 hidden rounded-xl bg-black p-5 text-white lg:block">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          Just do it
        </p>
        <p className="mt-2 text-lg font-black leading-tight">
          Move with
          <br />
          purpose.
        </p>
        <FontAwesomeIcon
          icon={faBoxOpen}
          className="mt-5 text-xl text-zinc-400"
        />
      </div>
    </aside>
  );
}

export default DashboardSideBar;
