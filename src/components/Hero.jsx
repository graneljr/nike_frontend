import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-zinc-100">
      <div className="mx-auto grid min-h-[60svh] max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 sm:min-h-[70vh] sm:gap-10 sm:px-8 sm:py-14 lg:grid-cols-2 lg:py-20">
        <motion.div
          className="order-2 lg:order-1"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
            New season essentials
          </p>
          <h1 className="max-w-xl text-4xl font-black uppercase leading-[0.95] tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Move with purpose.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-600">
            Discover everyday performance and iconic style, made for wherever the
            day takes you.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block rounded-full bg-black px-7 py-3.5 font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-800"
          >
            Shop Now
          </Link>
        </motion.div>
        <motion.div
          className="order-1 flex aspect-square items-center justify-center overflow-hidden lg:order-2"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src="/products/hero-shoe.png"
            alt="Nike running shoe"
            className="h-full w-full object-contain"
            animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, -1, 0] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
