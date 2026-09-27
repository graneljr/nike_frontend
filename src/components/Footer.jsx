import { Link } from "react-router-dom";

function Footer() {
  const collections = ["Running", "Basketball", "Lifestyle", "Training"];

  return (
    <footer className="bg-black  text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link
              to="/"
              className="text-2xl font-black italic tracking-tighter"
            >
              NIKE
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
              Everyday movement. Simple style. Find the right pair for every
              step.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Shop
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-zinc-400">
              {collections.map((category) => (
                <li key={category}>
                  <Link
                    to={`/shop?category=${category}`}
                    className="transition hover:text-white"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Quick links
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-zinc-400">
              <li>
                <Link to="/" className="transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="transition hover:text-white">
                  All Shoes
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition hover:text-white">
                  Your Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Help
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-zinc-400">
              <li>
                <a
                  href="https://www.nike.com/ph/help"
                  className="transition hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="https://www.nike.com/ph/help/a/shipping-delivery-gs?_gl=1*281xz6*_up*MQ..*_gs*MQ..&gclid=Cj0KCQjw5bjVBhCiARIsAJzMVnQh_fi-twNqDsFjw0jQvFD1e6XKXj1Fok0Z76GTwno-ZuBYb1z01f0aAnlzEALw_wcB&gclsrc=aw.ds"
                  className="transition hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Delivery
                </a>
              </li>
              <li>
                <a
                  href="https://www.nike.com/ph/help/a/returns-policy-gs?_gl=1*17f6jtg*_up*MQ..*_gs*MQ..&gclid=Cj0KCQjw5bjVBhCiARIsAJzMVnQnWfa3QNYXioLnbC-FJvocatxSzgoYCUCawEU2omzloHy9Bc4XFbgaAtYjEALw_wcB&gclsrc=aw.ds"
                  className="transition hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                 Return
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-zinc-800 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Nike Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
