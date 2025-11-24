import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClientBids, setBidStatus } from "../Service/ClientService";

const ProjectBidsPage = () => {
  const { id: projectId } = useParams();
  const [bids, setBids] = useState([]);

  const fetchBids = async () => {
    try {
      const data = await getClientBids(projectId);
      setBids(data);
    } catch (error) {
      console.error("Failed to load bids", error);
    }
  };

  const updateBid = async (freelancerId, status) => {
    await setBidStatus(projectId, freelancerId, status);
    fetchBids();
  };

  useEffect(() => {
    fetchBids();
  }, [projectId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Bids for Project #{projectId}</h2>

      {bids.length === 0 ? (
        <p className="text-gray-500">No bids received yet.</p>
      ) : (
        <div className="space-y-5">
          {bids.map((b, index) => (
            <div key={index} className="p-5 bg-white shadow-lg rounded-xl border">
              <h3 className="text-lg font-bold">₹{b.bidAmount}</h3>
              <p className="text-gray-700 mt-2">{b.message}</p>

              <p className="mt-2 text-sm text-gray-500">
                Status: <span className="font-semibold">{b.status}</span>
              </p>

              <p className="mt-1 text-blue-600 font-semibold">
                Freelancer: {b.name}
              </p>

              <button
                className="px-3 py-1 bg-green-500 text-white rounded"
                onClick={() => updateBid(b.freelancerId, "ACCEPTED")}
              >
                Accept
              </button>

              <button
                className="px-3 py-1 bg-red-500 text-white rounded ml-3"
                onClick={() => updateBid(b.freelancerId, "REJECTED")}
              >
                Reject
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectBidsPage;
