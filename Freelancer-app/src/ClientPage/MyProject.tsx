// import React, { useEffect, useState } from "react";
// import { getMyProjects } from "../Service/ClientService";

// const MyProjects = ({ openProjectDetails }) => {
//   const [projects, setProjects] = useState([]);

//   const fetchMyProjects = async () => {
//     try {
//       const data = await getMyProjects();
//       setProjects(data);
//     } catch (error) {
//       console.error("Failed to fetch projects", error);
//     }
//   };

//   useEffect(() => {
//     fetchMyProjects();
//   }, []);

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">My Projects</h2>

//       {projects.length === 0 ? (
//         <p className="text-gray-500">You have not created any projects yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 gap-5">
//           {projects.map((p) => (
//             <div
//               key={p.id}
//               className="cursor-pointer p-6 rounded-xl shadow-md bg-white border hover:shadow-xl transition transform hover:-translate-y-1"
//               onClick={() => openProjectDetails(p.id)}
//             >
//               <h3 className="text-xl font-bold">{p.title}</h3>
//               <p className="text-gray-600">{p.description}</p>
//               <p className="mt-2 font-semibold">Budget: ₹{p.budget}</p>
//               <p className="text-blue-600 mt-2">View Bids →</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyProjects;

import React, { useEffect, useState } from "react";
import { getMyProjects } from "../Service/ClientService";

const MyProjects = ({ openProjectDetails }) => {
  const [projects, setProjects] = useState([]);

  const fetchMyProjects = async () => {
    try {
      const data = await getMyProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Projects</h2>

      {projects.length === 0 ? (
        <p className="text-gray-500">You have not created any projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {projects.map((p) => {
            const isAssigned = p.status === "ASSIGNED";

            return (
              <div
                key={p.id}
                className={`p-6 rounded-xl shadow-md border transition transform
                  ${isAssigned
                    ? "bg-gray-300 cursor-not-allowed opacity-60"
                    : "bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  }`}
                onClick={() => !isAssigned && openProjectDetails(p.id)}
              >
                <h3 className="text-xl font-bold">{p.title}</h3>
                <p className="text-gray-600">{p.description}</p>

                <p className="mt-2 font-semibold">Budget: ₹{p.budget}</p>

                {isAssigned ? (
                  <p className="text-red-600 font-semibold mt-2">
                    Freelancer Hired (Assigned)
                  </p>
                ) : (
                  <p className="text-blue-600 mt-2">View Bids →</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProjects;
