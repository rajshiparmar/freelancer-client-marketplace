import React, { useState } from "react";
import bgLogin from "../assets/bg-login.jpg";
import { Link } from "react-router-dom";
import { loginUser } from "../Service/UserService";
import { useNavigate } from "react-router-dom";
import { parseJwt } from "../utils/jwtHelper";

const LoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser(formData);
      localStorage.setItem("token", result.token);

      const user = parseJwt(result.token);

      if (user.role === "CLIENT") navigate("/client");
      else if (user.role === "FREELANCER") navigate("/freelancer");
      else navigate("/home");

      alert("Login Successful!");
    } catch {
      alert("Login Failed!");
    }
  };

  const handleChange = (a) => {
    setFormData({
      ...formData,
      [a.target.name]: a.target.value,
    });
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl p-7 rounded-2xl w-[420px] text-white">

        <h1 className="text-3xl font-bold text-center mb-5">LOGIN</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <div>
            <label className="text-md mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              placeholder="abc123@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          <div>
            <label className="text-md mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 cursor-pointer text-white/80"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-2.5 rounded-lg text-lg font-semibold bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90 transition shadow-lg shadow-blue-900/50"
          >
            Login
          </button>

          <div className="text-white text-sm text-center mt-1">
            Don't have an account?
            <Link className="underline ml-1" to="/register">
              Register
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
