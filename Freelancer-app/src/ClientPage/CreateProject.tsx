import React, { useState } from "react";
import { parseJwt } from "../utils/jwtHelper";
import { AddProject } from "../Service/ClientService";

const CreateProject = () => {
  const token = localStorage.getItem("token");
  const user = parseJwt(token);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [inputSkill, setInputSkill] = useState("");
  const [ProjectData, setProjectData] = useState({
    title: "",
    description: "",
    budget: "",
  });

  const predefinedSkills = [
    "Java",
    "Spring",
    "React",
    "SQL",
    "Node.js",
    "Python",
    "AWS",
    "MongoDB",
    "JavaScript",
  ];

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSkillInputKey = (e) => {
    if (e.key === "Enter" && inputSkill.trim() !== "") {
      const skill = inputSkill.trim();
      if (!selectedSkills.includes(skill)) {
        setSelectedSkills([...selectedSkills, skill]);
      }
      setInputSkill("");
      e.preventDefault();
    }
  };

  const removeSkill = (skill) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const finalPayload = {
    title: ProjectData.title,
    description: ProjectData.description,
    budget: ProjectData.budget,
    requiredSkillNames: selectedSkills,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await AddProject(finalPayload);
      console.log("PROJECT ADDED SUCCESS:", result);
      alert("Project created successfully!");
    } catch (error) {
      console.error("PROJECT NOT ADDED:", error);
      alert("Failed to create project!");
    }
  };

  const handleChange = (e) => {
    setProjectData({
      ...ProjectData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full h-full flex justify-center items-start p-5 bg-white">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-10 w-[700px] mt-5">
        <h2 className="text-2xl font-bold mb-6">Create Project</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="font-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={ProjectData.title}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Description</label>
            <textarea
              name="description"
              value={ProjectData.description}
              onChange={handleChange}
              className="border p-3 rounded-xl h-[120px]"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Budget</label>
            <input
              type="number"
              name="budget"
              value={ProjectData.budget}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />
          </div>

          <div>
            <p className="font-semibold mb-2">Selected Skills</p>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.length === 0 && (
                <p className="text-gray-500 text-sm">No skills selected</p>
              )}
              {selectedSkills.map((skill) => (
                <div
                  key={skill}
                  className="px-3 py-1 bg-blue-600 text-white rounded-full flex items-center gap-2"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="font-bold hover:text-red-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold">Add Custom Skill</label>
            <input
              type="text"
              value={inputSkill}
              onChange={(e) => setInputSkill(e.target.value)}
              onKeyDown={handleSkillInputKey}
              placeholder="Type a skill and press Enter"
              className="border p-3 rounded-xl w-full mt-2"
            />
          </div>

          <div>
            <p className="font-semibold mb-2">Popular Skills</p>
            <div className="flex flex-wrap gap-2">
              {predefinedSkills.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm border ${selectedSkills.includes(skill)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-200 text-black border-gray-300"
                    }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
