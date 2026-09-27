import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-zinc-100">
      <div className="mx-auto grid min-h-[70vh] max-w-7xl grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-20">
        <div className="order-2 lg:order-1">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500">New season essentials</p>
          <h1 className="max-w-xl text-5xl font-black uppercase leading-none tracking-tighter sm:text-6xl lg:text-7xl">
            Move with purpose.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-600">
            Discover everyday performance and iconic style, made for wherever the day takes you.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block rounded-full bg-black px-7 py-3.5 font-medium text-white transition hover:bg-zinc-800"
          >
            Shop Now
          </Link>
        </div>
        <div className="order-1 flex aspect-square items-center justify-center overflow-hidden lg:order-2">
          <img
            src="/products/hero-shoe.png"
            alt="Nike running shoe"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
