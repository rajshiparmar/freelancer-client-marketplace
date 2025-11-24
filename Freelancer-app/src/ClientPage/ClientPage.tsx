import React, { useState } from "react";
import sidebar from "../assets/side-bar.jpg";
import Profile from "./Profile";
import CreateProject from "./CreateProject";
import MyProject from "./MyProject";
import ProjectDetails from "./ProjectDetails";
import Analytics from "./Analytics";
import AssignedProjects from "./AssignedProjects";
import AssignedProjectDetails from "./AssignedProjectDetails";

const ClientPage = () => {
  const [activePage, setActivePage] = useState("profile");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedAssignedId, setSelectedAssignedId] = useState(null);

  const openProjectDetails = (projectId) => {
    setSelectedProjectId(projectId);
    setActivePage("details");
  };

  const openAssignedDetails = (projectId) => {
    setSelectedAssignedId(projectId);
    setActivePage("assignedDetails");
  };

  const goBackToProjects = () => {
    setActivePage("allProject");
  };

  const backToAssignedList = () => {
    setActivePage("assigned");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="w-full min-h-screen flex">
      <aside
        className="w-[300px] h-screen bg-cover bg-center rounded-xl shadow-xl flex flex-col items-center gap-4 p-4"
        style={{ backgroundImage: `url(${sidebar})` }}
      >
        <h2 className="font-bold text-white text-[3rem] mb-20">FindJob.in</h2>

        <button
          onClick={() => setActivePage("profile")}
          className="w-full p-2 rounded-xl text-md font-semibold bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-400 hover:to-blue-400 transition-all duration-300"
        >
          Profile
        </button>

        <button
          onClick={() => setActivePage("create")}
          className="w-full p-2 rounded-xl text-md font-semibold bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-400 hover:to-blue-400 transition-all duration-300"
        >
          Create Project
        </button>

        <button
          onClick={() => setActivePage("allProject")}
          className="w-full p-2 rounded-xl text-md font-semibold bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-400 hover:to-blue-400 transition-all duration-300"
        >
          My Project
        </button>

        <button
          onClick={() => setActivePage("assigned")}
          className="w-full p-2 rounded-xl text-md font-semibold bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-400 hover:to-blue-400 transition-all duration-300"
        >
          Assigned Projects
        </button>

        <button
          onClick={() => setActivePage("analytics")}
          className="w-full p-2 rounded-xl text-md font-semibold bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-400 hover:to-blue-400 transition-all duration-300"
        >
          Analytics
        </button>

        <button
          onClick={handleLogout}
          className="w-full p-2 rounded-xl text-md font-semibold bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-400 hover:to-blue-400 transition-all duration-300"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto p-10 bg-white">
        {activePage === "profile" && <Profile />}
        {activePage === "create" && <CreateProject />}
        {activePage === "analytics" && <Analytics />}
        {activePage === "allProject" && (
          <MyProject openProjectDetails={openProjectDetails} />
        )}
        {activePage === "details" && (
          <ProjectDetails id={selectedProjectId} goBack={goBackToProjects} />
        )}
        {activePage === "assigned" && (
          <AssignedProjects openAssignedDetails={openAssignedDetails} />
        )}
        {activePage === "assignedDetails" && (
          <AssignedProjectDetails
            projectId={selectedAssignedId}
            goBack={backToAssignedList}
          />
        )}
      </main>
    </div>
  );
};

export default ClientPage;
