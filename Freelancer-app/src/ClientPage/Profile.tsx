import React, { useEffect, useState } from "react";
import { parseJwt } from "../utils/jwtHelper";
import { motion } from "framer-motion";
import { getMyProjects } from "../Service/ClientService";

const Profile = () => {
  const token = localStorage.getItem("token");
  const user = parseJwt(token);
  const [totalInvested, setTotalInvested] = useState(0);

  const fetchTotalInvested = async () => {
    const projects = await getMyProjects();
    const total = projects.reduce(
      (sum, project) => sum + Number(project.budget || 0),
      0
    );
    setTotalInvested(total);
  };

  useEffect(() => {
    fetchTotalInvested();
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white border border-gray-200 p-10 rounded-2xl shadow-xl w-[500px] flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 text-white flex items-center justify-center text-4xl font-bold mb-6"
        >
          {user?.name?.charAt(0).toUpperCase()}
        </motion.div>

        <div className="w-full mb-4">
          <p className="text-gray-500 text-sm uppercase">Name</p>
          <p className="text-2xl font-semibold">{user?.name}</p>
        </div>

        <div className="w-full mb-4">
          <p className="text-gray-500 text-sm uppercase">Email</p>
          <p className="text-lg">{user?.email}</p>
        </div>

        <div className="w-full mb-4">
          <p className="text-gray-500 text-sm uppercase">Phone</p>
          <p className="text-lg">–</p>
        </div>

        <div className="w-full mb-4">
          <p className="text-gray-500 text-sm uppercase">Date of Birth</p>
          <p className="text-lg">–</p>
        </div>

        <div className="w-full mb-4">
          <p className="text-gray-500 text-sm uppercase">Total Money Invested</p>
          <p className="text-lg font-semibold text-green-600">
            ₹{totalInvested.toLocaleString()}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
