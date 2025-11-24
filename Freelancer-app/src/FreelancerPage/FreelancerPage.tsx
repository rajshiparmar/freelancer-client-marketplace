import React, { useEffect, useState } from "react";
import { parseJwt } from "../utils/jwtHelper";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAllProjects } from "../Service/ClientService";

const FreelancerPage = () => {
  const [projects, setProjects] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = parseJwt(token);

  const fetchProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      console.log("Failed to load projects", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">FindJob.in</h1>

        <div className="relative">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 text-white flex items-center justify-center text-xl font-bold cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </motion.div>

          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border overflow-hidden"
            >
              <button
                onClick={() => navigate("/freelancer/profile")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </button>

              <button
                onClick={() => navigate("/freelancer/my-bids")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                My Bids
              </button>

              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Available Projects</h2>

        {projects.length === 0 ? (
          <p className="text-gray-500">No projects available right now.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white shadow-md border rounded-xl hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold">{p.title}</h3>
                <p className="text-gray-600">{p.description}</p>

                <p className="mt-2 font-semibold text-green-600">
                  Budget: ₹{p.budget}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {p.skills.map((s) => (
                    <span
                      key={s.id}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {s.skillname}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => navigate(`/freelancer/project/${p.id}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => navigate(`/freelancer/project/${p.id}/bid`)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black"
                  >
                    Place Bid
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerPage;
