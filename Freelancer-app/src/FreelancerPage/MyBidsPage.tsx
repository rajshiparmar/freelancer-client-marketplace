import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getMyBids, cancelBidById, updateBidById } from "../Service/Freelancerservice";

const MyBidsPage = () => {
  const [bids, setBids] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [editBid, setEditBid] = useState({ bidId: null, bidAmount: "", message: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const loadBids = async () => {
      try {
        const data = await getMyBids();
        setBids(data);
        setFilteredBids(data);
      } finally {
        setLoading(false);
      }
    };
    loadBids();
  }, []);

  useEffect(() => {
    if (filter === "ALL") setFilteredBids(bids);
    else setFilteredBids(bids.filter((b) => b.status === filter));
  }, [filter, bids]);

  const cancelBid = async (bidId) => {
    if (!window.confirm("Are you sure you want to cancel this bid?")) return;

    try {
      await cancelBidById(bidId);
      setBids((prev) => prev.filter((b) => b.bidId !== bidId));
    } catch {
      alert("Failed to cancel bid");
    }
  };

  const openUpdateModal = (bid) => {
    setEditBid({
      bidId: bid.bidId,
      bidAmount: bid.bidAmount,
      message: bid.message,
    });
    setShowModal(true);
  };

  const updateBid = async () => {
    try {
      await updateBidById(editBid);

      setBids((prev) =>
        prev.map((b) =>
          b.bidId === editBid.bidId
            ? { ...b, bidAmount: editBid.bidAmount, message: editBid.message }
            : b
        )
      );

      setShowModal(false);
    } catch {
      alert("Failed to update bid");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-5 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bids</h1>

      <div className="flex gap-3 mb-6">
        {["ALL", "PENDING", "ACCEPTED", "REJECTED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full border ${
              filter === status ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading bids...</p>
      ) : filteredBids.length === 0 ? (
        <p className="text-gray-500">No bids to show.</p>
      ) : (
        <div className="grid gap-6">
          {filteredBids.map((bid) => (
            <motion.div
              key={bid.bidId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-white rounded-xl shadow border"
            >
              <h2 className="text-xl font-bold">Project #{bid.projectId}</h2>

              <p className="text-gray-600 mt-2">Amount: ₹{bid.bidAmount}</p>
              <p className="text-gray-600">Message: {bid.message}</p>

              <p className="mt-2 font-semibold">
                Status:{" "}
                <span
                  className={
                    bid.status === "ACCEPTED"
                      ? "text-green-600"
                      : bid.status === "REJECTED"
                      ? "text-red-600"
                      : "text-orange-500"
                  }
                >
                  {bid.status}
                </span>
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => navigate(`/freelancer/project/${bid.projectId}`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  View Project
                </button>

                <button
                  onClick={() => openUpdateModal(bid)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                >
                  Update
                </button>

                <button
                  onClick={() => cancelBid(bid.bidId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
            <h2 className="text-xl font-bold mb-4">Update Bid</h2>

            <input
              type="number"
              value={editBid.bidAmount}
              onChange={(e) =>
                setEditBid({ ...editBid, bidAmount: e.target.value })
              }
              className="w-full border p-2 rounded mb-4"
              placeholder="Bid Amount"
            />

            <textarea
              value={editBid.message}
              onChange={(e) =>
                setEditBid({ ...editBid, message: e.target.value })
              }
              className="w-full border p-2 rounded mb-4"
              placeholder="Message"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateBid}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBidsPage;
