import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getProjectById } from "../Service/ClientService";

const FreelancerProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  const fetchProjectDetails = async () => {
    try {
      const data = await getProjectById(id);
      setProject(data);
    } catch (error) {
      console.log("Failed to load project details", error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  if (!project) {
    return <p className="p-6 text-gray-500">Loading project details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <button
        onClick={() => navigate(`/freelancer`)}
        className="px-4 py-2 bg-gray-700 text-white rounded-lg mb-6 hover:bg-black"
      >
        ← Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl border p-8 rounded-2xl"
      >
        <h1 className="text-4xl font-bold mb-3">{project.title}</h1>
        <p className="text-gray-600 text-lg mb-6">{project.description}</p>

        <div className="space-y-3">
          <p className="text-lg">
            <strong>Budget:</strong> ₹{project.budget}
          </p>

          <p className="text-lg">
            <strong>Status:</strong> {project.status}
          </p>

          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Required Skills</h3>

            {project.skills.length === 0 ? (
              <p className="text-gray-500">No skills listed</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {project.skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {s.skillname}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate(`/freelancer/project/${project.id}/bid`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Place Bid
          </button>

          <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black">
            Save for Later
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FreelancerProjectDetails;
