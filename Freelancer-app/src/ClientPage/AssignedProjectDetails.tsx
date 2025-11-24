import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, getAssignedProjects } from "../Service/ClientService";

const AssignedProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [assigned, setAssigned] = useState(null);

  const loadDetails = async () => {
    const projectData = await getProjectById(projectId);
    setProject(projectData);

    const assignedList = await getAssignedProjects();
    const match = assignedList.find((p) => p.projectId == projectId);
    setAssigned(match);
  };

  useEffect(() => {
    loadDetails();
  }, [projectId]);

  if (!project || !assigned) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/client")}
        className="mb-6 px-4 py-2 bg-gray-300 rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

      <p><strong>Description:</strong> {project.description}</p>
      <p><strong>Budget:</strong> ₹{project.budget}</p>

      <div className="mt-6 p-4 border rounded-xl bg-white">
        <h2 className="text-xl font-bold mb-2">Assigned Freelancer</h2>
        <p><strong>Name:</strong> {assigned.freelancerName}</p>
        <p><strong>Status:</strong> {assigned.status}</p>
      </div>
    </div>
  );
};

export default AssignedProjectDetails;
