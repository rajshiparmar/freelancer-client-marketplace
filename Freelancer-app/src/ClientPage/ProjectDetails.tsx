import React, { useEffect, useState } from "react";
import {
  getProjectById,
  getClientBids,
  setBidStatus,
  getMatchesById,
} from "../Service/ClientService";

const ProjectDetails = ({ id, goBack }) => {
  const projectId = id;

  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [matches, setMatches] = useState([]);

  const fetchProjectDetails = async () => {
    const data = await getProjectById(projectId);
    setProject(data);
  };

  const fetchBids = async () => {
    const data = await getClientBids(projectId);
    setBids(data);
  };

  const handleBidStatusChange = async (bidId, status) => {
    await setBidStatus(projectId, bidId, status);
    fetchBids();
  };


  const fetchMatches = async () => {
    try {
      const data = await getMatchesById(projectId);
      setMatches(data);
    } catch (error) {
      console.error("Failed to load matches", error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
    fetchBids();
    fetchMatches();
  }, [projectId]);

  if (!project) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="p-10 max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={goBack}
        className="px-4 py-2 mb-4 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-sm transition"
      >
        ← Back to My Projects
      </button>

      {/* Project Info */}
      <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-600 text-lg mb-6">{project.description}</p>

      <div className="bg-white shadow-md border p-6 rounded-xl space-y-2">
        <p className="text-lg"><strong>Budget:</strong> ₹{project.budget}</p>
        <p className="text-lg"><strong>Status:</strong> {project.status}</p>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Required Skills</h3>
          {project.skills?.length === 0 ? (
            <p className="text-gray-500">No skills added.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {project.skills.map((s) => (
                <span
                  key={s.id}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {s.skillname}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bids Section */}
      <h3 className="text-2xl font-bold mt-10 mb-3">Freelancer Bids</h3>
      {bids.length === 0 ? (
        <p className="text-gray-500">No bids yet.</p>
      ) : (
        <div className="space-y-4">
          {bids
            .filter((b) => b.status === "PENDING")
            .map((b) => (
              <div
                key={b.bidId}
                className="border shadow-sm rounded-lg p-4 hover:bg-gray-50"
              >
                <p className="font-semibold text-lg">{b.name}</p>
                <p className="text-gray-600">Bid Amount: ₹{b.bidAmount}</p>
                <p className="text-gray-600">Message: {b.message}</p>
                <p className="text-gray-600">Status: {b.status}</p>

                <div className="mt-3 flex gap-4">
                  <button
                    onClick={() =>
                      handleBidStatusChange(b.bidId, "ACCEPTED")
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleBidStatusChange(b.bidId, "REJECTED")
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Matched Freelancers */}
      <h3 className="text-2xl font-bold mt-10 mb-3">Matched Freelancers</h3>
      {matches.length === 0 ? (
        <p className="text-gray-500">No matched freelancers found.</p>
      ) : (
        <div className="space-y-4">
          {matches.map((m) => (
            <div
              key={m.freelancerId}
              className="border shadow-sm rounded-lg p-4 bg-white hover:bg-gray-50 transition"
            >
              <p className="text-lg font-semibold">{m.name}</p>

              <p className="text-gray-700">
                Match Score:{" "}
                <span className="font-bold text-blue-600">{m.matchScore}%</span>
              </p>

              {m.matchingSkills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {m.matchingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
