import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "../assets/bg-login.jpg";

const HomePage = () => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-10 rounded-3xl w-[1000px] text-white flex gap-10"
      >

        {/* LEFT SECTION */}
        <div className="w-[60%] flex flex-col justify-center">

          {/* PLATFORM LOGO */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-extrabold mb-3 tracking-wide drop-shadow-lg"
          >
            Find<span className="text-pink-400">Job</span>.in
          </motion.h1>

          {/* FOR BOTH CLIENT & FREELANCER */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/90 font-medium mb-6"
          >
            A platform crafted for <span className="text-pink-300 font-bold">Clients</span> &{" "}
            <span className="text-blue-300 font-bold">Freelancers</span> to connect, collaborate & grow.
          </motion.p>

          {/* TAGLINE */}
          <p className="text-lg text-white/85 mb-6">
            Post projects, bid easily, manage work & get hired — all in one smart dashboard.
          </p>

          {/* ABOUT US */}
          <div className="mt-2 space-y-3">
            <h3 className="text-2xl font-semibold">Why Choose FindJob.in?</h3>

            <div className="flex items-center gap-3 text-white/80">
              <span className="text-pink-300 text-xl">✔</span> Smart matching for clients & freelancers
            </div>

            <div className="flex items-center gap-3 text-white/80">
              <span className="text-pink-300 text-xl">✔</span> Easy bidding & transparent workflow
            </div>

            <div className="flex items-center gap-3 text-white/80">
              <span className="text-pink-300 text-xl">✔</span> Secure authentication with JWT
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl text-lg font-semibold shadow-lg hover:opacity-90 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-lg font-semibold shadow-lg hover:opacity-90 transition"
            >
              Register
            </Link>
          </div>

        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-[40%] hidden md:flex items-center justify-center"
        >
          <div className="h-[280px] w-[280px] rounded-full bg-gradient-to-r from-pink-400 to-blue-500 opacity-90 shadow-2xl flex items-center justify-center">
            <span className="text-4xl font-bold">FindJob.in</span>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default HomePage;
