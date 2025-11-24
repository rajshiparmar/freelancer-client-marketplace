import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAssignedProjects } from "../Service/ClientService";

const AssignedProjects = () => {
  const [assigned, setAssigned] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const data = await getAssignedProjects();
      setAssigned(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Assigned Projects</h2>

      {assigned.length === 0 ? (
        <p>No assigned projects</p>
      ) : (
        assigned.map((a) => (
          <div key={a.assignmentId} className="p-6 border rounded-xl">
            <h3 className="text-2xl font-bold">{a.projectTitle}</h3>
            <p><strong>Freelancer:</strong> {a.freelancerName}</p>
            <p><strong>Status:</strong> {a.status}</p>

            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={() => navigate(`/client/project/${a.projectId}/assigned`)}
            >
              View Project
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AssignedProjects;
