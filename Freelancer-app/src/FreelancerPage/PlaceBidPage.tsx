import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getFreelancerProfile, submitBid } from "../Service/Freelancerservice";

const PlaceBidPage = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [freelancerId, setFreelancerId] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadFreelancer = async () => {
    try {
      const data = await getFreelancerProfile();
      setFreelancerId(data.id);
    } catch {}
  };

  useEffect(() => {
    loadFreelancer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!freelancerId) return alert("Freelancer profile not loaded!");

    const payload = {
      projectId: Number(projectId),
      freelancerId: Number(freelancerId),
      bidAmount: Number(amount),
      message,
    };

    try {
      await submitBid(payload);
      setSuccess(true);

      setTimeout(() => {
        navigate(`/freelancer/project/${projectId}`);
      }, 1200);
    } catch {
      alert("Failed to submit bid");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-[500px]"
      >
        <h2 className="text-3xl font-bold mb-6">Place Your Bid</h2>

        {success && (
          <p className="text-green-600 font-semibold mb-4">
            ✔ Bid submitted successfully!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Bid Amount (₹)</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter your bid amount"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Message / Proposal</label>
            <textarea
              className="w-full p-3 border rounded-lg h-28"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Why should the client hire you?"
              required
            ></textarea>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loading ? "Submitting..." : "Submit Bid"}
          </button>
        </form>

        <button
          onClick={() => navigate(`/freelancer/project/${projectId}`)}
          className="mt-4 w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-black"
        >
          Back to Project
        </button>
      </motion.div>
    </div>
  );
};

export default PlaceBidPage;
