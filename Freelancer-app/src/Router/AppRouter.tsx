import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "../Page/Home.tsx"
import RegisterPage from "../Page/RegisterPage";
import LoginPage from "../Page/LoginPage";
import ClientPage from "../ClientPage/ClientPage";
import FreelancerPage from "../FreelancerPage/FreelancerPage.tsx";

import RoleRoute from "./RoleRoute.tsx";

import ProjectDetails from "../ClientPage/ProjectDetails.tsx";
import FreelancerProjectDetails from "../FreelancerPage/FreelancerProjectDetails.tsx";
import PlaceBidPage from "../FreelancerPage/PlaceBidPage.tsx";
import FreelancerProfile from "../FreelancerPage/FreelancerProfile.tsx";
import MyBidsPage from "../FreelancerPage/MyBidsPage.tsx";
import ProjectBidsPage from "../ClientPage/ProjectBidsPage.tsx";
import AssignedProjectDetails from "../ClientPage/AssignedProjectDetails.tsx";

const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/client" element={<RoleRoute role="CLIENT"><ClientPage /></RoleRoute>} />
            <Route path="/freelancer" element={<RoleRoute role="FREELANCER"><FreelancerPage /></RoleRoute>} />

            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/freelancer/project/:id" element={<FreelancerProjectDetails />} />
            <Route path="/freelancer/project/:id/bid" element={<PlaceBidPage />} />
            <Route path="/freelancer/profile" element={<FreelancerProfile />} />
            <Route path="/freelancer/my-bids" element={<MyBidsPage />} />

            <Route path="/client/project/:id/bids" element={<ProjectBidsPage />} />
            <Route path="/client/project/:projectId/assigned" element={<AssignedProjectDetails />} />
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
