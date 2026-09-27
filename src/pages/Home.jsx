import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import products from "../data/products";

const categories = [
  { name: "Running", image: "/products/pegasus-41.png" },
  { name: "Basketball", image: "/products/kobe-ad-mid.png" },
  { name: "Lifestyle", image: "/products/air-max-solo.png" },
  { name: "Training", image: "/products/metcon-9.png" },
];

function Home() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Selected for you</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Featured</h2>
          </div>
          <Link to="/shop" className="hidden text-sm font-medium underline underline-offset-4 hover:text-zinc-600 sm:block">
            View all
          </Link>
        </div>
        <ProductGrid products={products.slice(0, 4)} />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Shop by category</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${category.name}`}
              className="group relative flex min-h-72 items-end overflow-hidden bg-zinc-100 p-6"
            >
              <img
                src={category.image}
                alt=""
                className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-105"
              />
              <span className="relative rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">Made to move</p>
          <h2 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-6xl">Just do it.</h2>
          <p className="mx-auto mt-5 max-w-md text-zinc-300">Designed for movement. Built for everyday life.</p>
          <Link to="/shop" className="mt-8 inline-block rounded-full bg-white px-7 py-3.5 font-medium text-black transition hover:bg-zinc-200">
            Explore Collection
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
