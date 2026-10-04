import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
function Navbar({ cartCount, userData }) {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition hover:text-black ${
      isActive ? "text-black" : "text-zinc-500"
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <NavLink
          to="/"
          className="text-xl font-black italic tracking-tighter transition-transform duration-300 hover:scale-105"
          aria-label="Nike Minimal Store home"
        >
          NIKE
        </NavLink>
        <div className="flex items-center gap-6 sm:gap-9">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={linkClass}>
            Shop
          </NavLink>
          {userData ? (
            <NavLink to="dashboard" className={linkClass}>
              <FontAwesomeIcon icon={faUser} />
            </NavLink>
          ) : (
            <NavLink to="/register" className={linkClass}>
              Sign in
            </NavLink>
          )}
          {
            userData?.role !== "admin" && <NavLink to="/cart" className={linkClass}>
            Cart{" "}
            <span className="ml-1 rounded-full bg-black px-2 py-1 text-xs text-white transition-transform duration-300 hover:scale-110">
              {cartCount}
            </span>
          </NavLink>
          }
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
