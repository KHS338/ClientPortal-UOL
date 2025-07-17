// app/roles/leadsGeneration/page.js
"use client";
import React, { useState, useEffect } from "react";

// Industry Form Component
const IndustryForm = () => {
  const [formData, setFormData] = useState({
    industryType: "",
    companySize: "",
    cityCountry: "",
    companyName: "",
    leadPriority: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log("Industry Form Data:", formData);
    // Handle form submission here
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl transition-all duration-300 hover:shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Industry Information
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Industry Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry Type *
            </label>
            <div className="relative">
              <select
                name="industryType"
                value={formData.industryType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjsfk0JyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10"
              >
                <option value="">Select Industry Type</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail">Retail</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Company Size */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Size *
            </label>
            <div className="relative">
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjsfk0JyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10"
              >
                <option value="">Select Company Size</option>
                <option value="startup">Startup (1-10)</option>
                <option value="small">Small (11-50)</option>
                <option value="medium">Medium (51-200)</option>
                <option value="large">Large (201-1000)</option>
                <option value="enterprise">Enterprise (1000+)</option>
              </select>
            </div>
          </div>

          {/* City/Country */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City/Country *
            </label>
            <input
              type="text"
              name="cityCountry"
              value={formData.cityCountry}
              onChange={handleChange}
              placeholder="e.g., New York, USA"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 hover:border-blue-400"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 hover:border-blue-400"
            />
          </div>
        </div>

        {/* Lead Priority */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lead Priority *
          </label>
          <div className="grid grid-cols-3 gap-4">
            {["High", "Medium", "Low"].map((priority) => (
              <label key={priority} className="flex items-center space-x-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-300 group-hover:border-blue-500 ${formData.leadPriority === priority.toLowerCase() ? 'border-blue-500 bg-blue-500' : ''}`}>
                  {formData.leadPriority === priority.toLowerCase() && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <input
                  type="radio"
                  name="leadPriority"
                  value={priority.toLowerCase()}
                  checked={formData.leadPriority === priority.toLowerCase()}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{priority}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 flex items-center gap-2"
          >
            <span>Submit Industry Info</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Jobs Form Component
const JobsForm = () => {
  const [formData, setFormData] = useState({
    industryType: "",
    companySize: "",
    workType: "",
    location: "",
    hiringUrgency: "",
    skills: [],
    experience: "",
    jobTitle: ""
  });

  const [currentSkill, setCurrentSkill] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() !== "" && !formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()]
      });
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = () => {
    console.log("Jobs Form Data:", formData);
    // Handle form submission here
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl transition-all duration-300 hover:shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Job Information
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Industry Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry Type *
            </label>
            <div className="relative">
              <select
                name="industryType"
                value={formData.industryType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjsfk0JyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10"
              >
                <option value="">Select Industry Type</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail">Retail</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Company Size */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Size *
            </label>
            <div className="relative">
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAw IDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjsfk0JyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10"
              >
                <option value="">Select Company Size</option>
                <option value="startup">Startup (1-10)</option>
                <option value="small">Small (11-50)</option>
                <option value="medium">Medium (51-200)</option>
                <option value="large">Large (201-1000)</option>
                <option value="enterprise">Enterprise (1000+)</option>
              </select>
            </div>
          </div>

          {/* Work Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Type *
            </label>
            <div className="relative">
              <select
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjsfk0JyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10"
              >
                <option value="">Select Work Type</option>
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., San Francisco, CA"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 hover:border-blue-400"
            />
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g., Senior Frontend Developer"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 hover:border-blue-400"
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level *
            </label>
            <div className="relative">
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjsfk0JyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10"
              >
                <option value="">Select Experience Level</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior Level (5-8 years)</option>
                <option value="lead">Lead Level (8+ years)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills Required *
          </label>
          
          {/* Skills Input */}
          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={handleSkillKeyPress}
              placeholder="Enter a skill and press Enter or click Add"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 hover:border-blue-400"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 whitespace-nowrap flex items-center gap-2 justify-center"
            >
              <span>Add Skill</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </button>
          </div>

          {/* Skills Tags */}
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 group transition-all duration-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none transition-colors duration-200 flex items-center"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hiring Urgency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hiring Urgency
          </label>
          <div className="grid grid-cols-3 gap-4">
            {["Urgent", "Normal", "Flexible"].map((urgency) => (
              <label key={urgency} className="flex items-center space-x-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-300 group-hover:border-blue-500 ${formData.hiringUrgency === urgency.toLowerCase() ? 'border-blue-500 bg-blue-500' : ''}`}>
                  {formData.hiringUrgency === urgency.toLowerCase() && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <input
                  type="radio"
                  name="hiringUrgency"
                  value={urgency.toLowerCase()}
                  checked={formData.hiringUrgency === urgency.toLowerCase()}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{urgency}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 flex items-center gap-2"
          >
            <span>Submit Job Info</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function RolesPage() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState("jobs");

  useEffect(() => {
    // Simulate data loading
    const getData = async () => {
      return [
        {
          no: 1,
          role: "Frontend Dev",
          focusPoint: "React UI",
          stages: "Interview",
          status: "pending",
          resourcers: "Alice",
          months: 3,
          salary: 75000,
          miles: 120,
          industry: "Tech",
          cvs: 5,
          lis: 2,
          zi: 0,
          tCandidates: 4,
          rejectedCvs: 1,
          rejectedLis: 0,
          rCandidates: NaN,
        },
        {
          no: 2,
          role: "Frontend Dev",
          focusPoint: "React UI",
          stages: "Interview",
          status: "pending",
          resourcers: "Alice",
          months: 3,
          salary: 75000,
          miles: 120,
          industry: "Tech",
          cvs: 5,
          lis: 2,
          zi: 0,
          tCandidates: 4,
          rejectedCvs: 1,
          rejectedLis: 0,
          rCandidates: NaN,
        },
      ];
    };

    getData().then(setData);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      {/* Toggle Buttons */}
      <div className="mx-auto mb-8 flex w-full max-w-md overflow-hidden rounded-xl border border-gray-300 shadow-md bg-white">
        <button
          onClick={() => setSelected("jobs")}
          className={`w-1/2 px-6 py-4 text-center font-bold transition-all duration-300 ${
            selected === "jobs"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-inner"
              : "bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600"
          }`}
        >
          Jobs
        </button>
        <button
          onClick={() => setSelected("industry")}
          className={`w-1/2 px-6 py-4 text-center font-bold transition-all duration-300 ${
            selected === "industry"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-inner"
              : "bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600"
          }`}
        >
          Industry
        </button>
      </div>

      {/* Form Container with Transition */}
      <div className="transition-all duration-500 ease-in-out">
        {selected === "jobs" && (
          <div className="opacity-100 transform translate-y-0 transition-all duration-500">
            <JobsForm />
          </div>
        )}
        {selected === "industry" && (
          <div className="opacity-100 transform translate-y-0 transition-all duration-500">
            <IndustryForm />
          </div>
        )}
      </div>
    </div>
  );
}
