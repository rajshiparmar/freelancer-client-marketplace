import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { parseJwt } from "../utils/jwtHelper";
import { useNavigate } from "react-router-dom";
import { getFreelancerProfile } from "../Service/Freelancerservice";

const FreelancerProfile = () => {
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = parseJwt(token);

  const name = user?.name || "Unnamed";
  const email = user?.sub || "No Email";

  const loadProfile = async () => {
    const data = await getFreelancerProfile();
    setFreelancer(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow"
      >
        ← Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-3xl shadow-xl w-[600px]"
      >
        <div className="flex justify-center">
          <div className="h-28 w-28 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
        </div>

        <h2 className="text-center text-3xl font-bold mt-4">{name}</h2>
        <p className="text-center text-gray-600">{email}</p>

        <div className="mt-8 space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Name</span>
            <span>{name}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Email</span>
            <span>{email}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Experience</span>
            <span>{freelancer?.experienceLevel ?? "BEGINNER"}</span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Skills</h3>

          {freelancer.skills && freelancer.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {freelancer.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                >
                  {skill.skillName}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills added.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FreelancerProfile;
