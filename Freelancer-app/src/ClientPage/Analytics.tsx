import React, { useEffect, useState } from "react";
import ClientInterceptor from "../Interceptor/ClientInterceptor";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#9C27B0", "#4CAF50"];

const Analytics = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await ClientInterceptor.get("/projects/my");
      setProjects(res.data);
    } catch (err) {
      console.log("Failed to fetch analytics", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (projects.length === 0)
    return (
      <p className="text-gray-500 text-lg">No project data available for analytics.</p>
    );

  const totalProjects = projects.length;
  const openProjects = projects.filter(p => p.status === "OPEN").length;
  const budgets = projects.map(p => Number(p.budget || 0));
  const totalBudget = budgets.reduce((a, b) => a + b, 0);

  const budgetChartData = projects.map(p => ({
    name: p.title,
    budget: Number(p.budget),
  }));

  let skillCount = {};
  projects.forEach(project => {
    project.skills?.forEach(skill => {
      skillCount[skill.skillname] = (skillCount[skill.skillname] || 0) + 1;
    });
  });

  const skillData = Object.entries(skillCount).map(([skill, count]) => ({
    name: skill,
    value: count,
  }));

  return (
    <div className="animate-fadeIn">

      <h1 className="text-4xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white shadow-md rounded-xl border">
          <h3 className="text-lg font-semibold">Total Projects</h3>
          <p className="text-3xl font-bold">{totalProjects}</p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-xl border">
          <h3 className="text-lg font-semibold">Open Projects</h3>
          <p className="text-3xl font-bold">{openProjects}</p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-xl border">
          <h3 className="text-lg font-semibold">Total Budget</h3>
          <p className="text-3xl font-bold">₹{totalBudget.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white p-6 shadow-md rounded-xl border mb-10">
        <h2 className="text-2xl font-bold mb-4">Project Budget Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="budget" fill="#36A2EB" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 shadow-md rounded-xl border">
        <h2 className="text-2xl font-bold mb-4">Skill Usage Breakdown</h2>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={skillData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {skillData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
