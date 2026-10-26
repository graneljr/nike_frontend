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
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
        <NavLink
          to="/"
          className="shrink-0 text-lg font-black italic tracking-tighter transition-transform duration-300 hover:scale-105 sm:text-xl"
          aria-label="Nike Minimal Store home"
        >
          NIKE
        </NavLink>
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-6 md:gap-9">
          <NavLink
            to="/"
            className={`${linkClass} whitespace-nowrap text-xs sm:text-sm`}
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={`${linkClass} whitespace-nowrap text-xs sm:text-sm`}
          >
            Shop
          </NavLink>
          <NavLink
            to="/contact"
            className={`${linkClass} whitespace-nowrap text-xs sm:text-sm`}
          >
            Contact
          </NavLink>
          {userData ? (
            <NavLink
              to="/dashboard"
              className={`${linkClass} whitespace-nowrap text-xs sm:text-sm`}
            >
              <FontAwesomeIcon icon={faUser} />
            </NavLink>
          ) : (
            <NavLink
              to="/register"
              className={`${linkClass} whitespace-nowrap text-xs sm:text-sm`}
            >
              Sign in
            </NavLink>
          )}
          {userData && userData?.role !== "admin" && (
            <NavLink
              to="/cart"
              className={`${linkClass} whitespace-nowrap text-xs sm:text-sm`}
            >
              Cart{" "}
              <span className="ml-1 rounded-full bg-black px-2 py-1 text-xs text-white transition-transform duration-300 hover:scale-110">
                {cartCount}
              </span>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
