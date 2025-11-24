import React, { useState } from "react";
import bgLogin from "../assets/bg-login.jpg";
import { Link } from "react-router-dom";
import { registerUser } from "../Service/UserService";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordValid = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(
      password
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!passwordValid(formData.password)) {
      alert("Password must be 8+ chars, uppercase, lowercase, number, special char.");
      return;
    }

    try {
      await registerUser(formData);
      alert("User Registered Successfully!");
    } catch {
      alert("Registration Failed!");
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
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl p-7 rounded-2xl w-[420px] text-white">

        <h1 className="text-3xl font-bold text-center mb-5">REGISTER</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <div>
            <label className="text-md mb-1 block">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg bg-white/20 border border-white/30 text-white"
              required
            />
          </div>

          <div>
            <label className="text-md mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              placeholder="abc123@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg bg-white/20 border border-white/30 text-white"
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
                className="w-full p-2.5 rounded-lg bg-white/20 border text-white"
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

          <div>
            <label className="text-md mb-1 block">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-white/20 border text-white"
              required
            />
          </div>

          {/* Adjusted role section height */}
          <div>
            <label className="text-md mb-1 block">Register As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg bg-white/20 border text-white"
              required
            >
              <option className="text-black" value="">
                Select Role
              </option>
              <option className="text-black" value="CLIENT">
                Client
              </option>
              <option className="text-black" value="FREELANCER">
                Freelancer
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full p-2.5 rounded-lg text-lg font-semibold bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90 transition"
          >
            Register
          </button>

          <div className="text-white text-sm text-center mt-1">
            Already have an account?
            <Link className="underline ml-1" to="/login">
              Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
