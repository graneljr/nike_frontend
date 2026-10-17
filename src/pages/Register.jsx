import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "@/middleware/apiMiddleware";

function Register() {
  const [createUser, setCreateUser] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register",
        createUser
      );
  
      alert(response.data.message || "Registration successful!");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <section className="flex min-h-screen min-h-[100svh] items-center justify-center bg-zinc-50 px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_-32px_rgba(0,0,0,0.25)] lg:min-h-[620px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="order-2 flex items-center justify-center px-6 py-8 sm:px-12 sm:py-10 lg:order-1 lg:px-14 lg:py-12">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                Join the movement
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
                Create your account
              </h1>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Get set for your next pair. Sign up for a faster, smoother
                checkout.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-zinc-800"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Full name"
                  value={createUser.fullName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-zinc-800"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={createUser.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-zinc-800"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={createUser.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5"
                />
              </div>

              <button
                type="submit"
                className="mt-1 w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/20"
              >
                Create account{" "}
                <span aria-hidden="true" className="ml-1">
                  →
                </span>
              </button>

              <div className="flex flex-col justify-center">
                <div className="flex w-full items-center gap-2 text-gray-400">
                  <span className="h-0.5 w-1/2 bg-gray-300" />
                  <p>or</p>
                  <span className="h-0.5 w-1/2 bg-gray-300" />
                </div>
                <Link
                  to="/login"
                  className="w-full rounded-md border border-slate-200 py-2 text-center"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="relative order-1 h-48 overflow-hidden bg-[#416b4b] sm:h-56 lg:order-2 lg:h-auto lg:min-h-[620px]">
          <img
            src="/products/hero-shoe.png"
            alt="Featured sneaker from the latest collection"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8 lg:p-10 xl:p-14">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/75">
              Made to move
            </p>
            <h2 className="mt-2 max-w-sm text-2xl font-black uppercase leading-[0.98] tracking-tight sm:text-3xl lg:mt-3 lg:text-4xl xl:text-5xl">
              Find your next everyday essential.
            </h2>
            <Link
              to="/shop"
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white underline decoration-white/60 underline-offset-4 transition hover:decoration-white sm:mt-5 sm:text-sm"
            >
              Explore the collection <span aria-hidden="true">→</span>
            </Link>
          </div>
          <span className="absolute right-4 top-4 rounded-full border border-white/40 bg-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm sm:right-6 sm:top-6 sm:text-xs">
            New season
          </span>
        </div>
      </div>
    </section>
  );
}

export default Register;
