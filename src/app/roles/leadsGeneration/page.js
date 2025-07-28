// app/roles/leadsGeneration/page.js
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { DataTable } from "./data-table";
import { jobsColumns, industryColumns } from "./columns";
import AddRoleForm from "./AddRoleForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

// Add animation keyframes using style tag
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0px); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }

  .animate-slideUpFade {
    animation: slideUpFade 0.6s ease-out forwards;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .perspective-1000 {
    perspective: 1000px;
  }

  .hover-trigger:hover .hover-target {
    transform: scale(1.02);
    transition: all 0.3s ease;
  }

  input, select {
    transition: all 0.3s ease;
  }

  input:focus, select:focus {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px -8px rgba(9, 88, 217, 0.2);
  }
`;

// Insert style tag
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);
}

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
  "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China",
  "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
  "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
  "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// Industry Form Component
const IndustryForm = ({ onSubmit, editingData, onCancel, onError }) => {
  const [formData, setFormData] = useState({
    industryType: "",
    companySize: "",
    cityCountry: [],
    leadPriority: ""
  });
  
  const [isCountryListOpen, setIsCountryListOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [currentCountryInput, setCurrentCountryInput] = useState("");
  
  // Load editing data if provided
  useEffect(() => {
    if (editingData) {
      setFormData({
        industryType: editingData.industryType || "",
        companySize: editingData.companySize || "",
        cityCountry: Array.isArray(editingData.cityCountry) ? editingData.cityCountry : (editingData.cityCountry ? editingData.cityCountry.split(',') : []),
        leadPriority: editingData.leadPriority || ""
      });
    }
  }, [editingData]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.country-selector')) {
        setIsCountryListOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddCountry = (country) => {
    if (country && !formData.cityCountry.includes(country)) {
      setFormData({
        ...formData,
        cityCountry: [...formData.cityCountry, country]
      });
      setCurrentCountryInput("");
      setIsCountryListOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleRemoveCountry = (countryToRemove) => {
    setFormData({
      ...formData,
      cityCountry: formData.cityCountry.filter(country => country !== countryToRemove)
    });
  };

  const handleSubmit = () => {
    if (!formData.industryType || !formData.companySize || formData.cityCountry.length === 0 || !formData.leadPriority) {
      onError('Please fill in all required fields and select at least one country');
      return;
    }
    onSubmit(formData);
    // Reset form
    setFormData({
      industryType: "",
      companySize: "",
      cityCountry: [],
      leadPriority: ""
    });
    setCurrentCountryInput("");
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl transition-all duration-300 hover:shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
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
                disabled={!!editingData} // Make read-only when editing
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1a84de] focus:border-[#1a84de] outline-none transition-all duration-300 hover:border-[#1a84de]/50 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjsfk0JyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10 ${
                  editingData ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1a84de] focus:border-[#1a84de] outline-none transition-all duration-300 hover:border-[#1a84de]/50 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjsfk0JyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10"
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

          {/* Country */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location(s) 
            </label>
            <div className="relative country-selector">
              <input
                type="text"
                value={currentCountryInput}
                onChange={(e) => {
                  setCurrentCountryInput(e.target.value);
                  setIsCountryListOpen(true);
                  setHighlightedIndex(-1);
                }}
                onFocus={() => {
                  setIsCountryListOpen(true);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={(e) => {
                  const filteredCountries = countries.filter(country => 
                    country.toLowerCase().includes(currentCountryInput.toLowerCase()) &&
                    !formData.cityCountry.includes(country)
                  );
                  
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setHighlightedIndex(prev => 
                      prev < filteredCountries.length - 1 ? prev + 1 : prev
                    );
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (highlightedIndex >= 0 && highlightedIndex < filteredCountries.length) {
                      handleAddCountry(filteredCountries[highlightedIndex]);
                    } else if (filteredCountries.length === 1) {
                      handleAddCountry(filteredCountries[0]);
                    }
                  } else if (e.key === 'Escape') {
                    setIsCountryListOpen(false);
                    setHighlightedIndex(-1);
                  }
                }}
                placeholder="Search and select countries"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1a84de] focus:border-[#1a84de] outline-none transition-all duration-300 hover:border-[#1a84de]/50"
                autoComplete="off"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {isCountryListOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                  {countries
                    .filter(country => 
                      country.toLowerCase().includes(currentCountryInput.toLowerCase()) &&
                      !formData.cityCountry.includes(country)
                    )
                    .map((country, index) => (
                      <div
                        key={country}
                        onClick={() => handleAddCountry(country)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`px-4 py-2 cursor-pointer transition-colors duration-200 ${
                          index === highlightedIndex 
                            ? 'bg-[#1a84de] text-white' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {country}
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            {/* Selected Countries Tags */}
            {formData.cityCountry.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.cityCountry.map((country, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#0958d9]/10 text-[#0958d9] border border-[#0958d9]/20 group transition-all duration-200"
                  >
                    {country}
                    <button
                      type="button"
                      onClick={() => handleRemoveCountry(country)}
                      className="ml-2 text-[#1a84de] hover:text-blue-800 focus:outline-none transition-colors duration-200 flex items-center"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
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
                <div className={`w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-300 group-hover:border-[#1a84de] ${formData.leadPriority === priority.toLowerCase() ? 'border-[#1a84de] bg-[#1a84de]' : ''}`}>
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
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#1a84de]">{priority}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl focus:outline-none transition-all duration-300 flex items-center gap-2"
          >
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#1a84de] hover:bg-[#24AC4A] text-white font-semibold rounded-xl focus:outline-none transition-all duration-300 flex items-center gap-2"
          >
            <span>{editingData ? 'Update' : 'Submit'} Industry Info</span>
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
const JobsForm = ({ onSubmit, editingData, onCancel, onError }) => {
  const [formData, setFormData] = useState({
    industryType: "",
    companySize: "",
    workType: "",
    location: [],
    hiringUrgency: "",
    skills: [],
    experience: "",
    jobTitle: ""
  });

  const [currentSkill, setCurrentSkill] = useState("");
  const [isCountryListOpen, setIsCountryListOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [currentLocationInput, setCurrentLocationInput] = useState("");
  
  // Load editing data if provided
  useEffect(() => {
    if (editingData) {
      setFormData({
        industryType: editingData.industryType || "",
        companySize: editingData.companySize || "",
        workType: editingData.workType || "",
        location: Array.isArray(editingData.location) ? editingData.location : (editingData.location ? editingData.location.split(',') : []),
        hiringUrgency: editingData.hiringUrgency || "",
        skills: Array.isArray(editingData.skills) ? editingData.skills : (editingData.skills ? editingData.skills.split(',') : []),
        experience: editingData.experience || "",
        jobTitle: editingData.jobTitle || ""
      });
    }
  }, [editingData]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.country-selector')) {
        setIsCountryListOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddLocation = (location) => {
    if (location && !formData.location.includes(location)) {
      setFormData({
        ...formData,
        location: [...formData.location, location]
      });
      setCurrentLocationInput("");
      setIsCountryListOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleRemoveLocation = (locationToRemove) => {
    setFormData({
      ...formData,
      location: formData.location.filter(location => location !== locationToRemove)
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
    if (!formData.jobTitle || !formData.industryType || !formData.companySize || formData.location.length === 0 || !formData.experience) {
      onError('Please fill in all required fields and select at least one location');
      return;
    }
    onSubmit(formData);
    // Reset form
    setFormData({
      industryType: "",
      companySize: "",
      workType: "",
      location: [],
      hiringUrgency: "",
      skills: [],
      experience: "",
      jobTitle: ""
    });
    setCurrentSkill("");
    setCurrentLocationInput("");
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl transition-all duration-300 hover:shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
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
                disabled={!!editingData} // Make read-only when editing
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1a84de] focus:border-[#1a84de] outline-none transition-all duration-300 hover:border-[#1a84de]/50 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjsfk0JyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ci8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10 ${
                  editingData ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1a84de] focus:border-[#1a84de] outline-none transition-all duration-300 hover:border-[#1a84de]/50 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAw IDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjsfk0JyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1a84de] focus:border-[#1a84de] outline-none transition-all duration-300 hover:border-[#1a84de]/50 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjsfk0JyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10"
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
              Location(s)
            </label>
            <div className="relative country-selector">
              <input
                type="text"
                value={currentLocationInput}
                onChange={(e) => {
                  setCurrentLocationInput(e.target.value);
                  setIsCountryListOpen(true);
                  setHighlightedIndex(-1);
                }}
                onFocus={() => {
                  setIsCountryListOpen(true);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={(e) => {
                  const filteredCountries = countries.filter(country => 
                    country.toLowerCase().includes(currentLocationInput.toLowerCase()) &&
                    !formData.location.includes(country)
                  );
                  
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setHighlightedIndex(prev => 
                      prev < filteredCountries.length - 1 ? prev + 1 : prev
                    );
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (highlightedIndex >= 0 && highlightedIndex < filteredCountries.length) {
                      handleAddLocation(filteredCountries[highlightedIndex]);
                    } else if (filteredCountries.length === 1) {
                      handleAddLocation(filteredCountries[0]);
                    }
                  } else if (e.key === 'Escape') {
                    setIsCountryListOpen(false);
                    setHighlightedIndex(-1);
                  }
                }}
                placeholder="Search and select locations"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1a84de] focus:border-[#1a84de] outline-none transition-all duration-300 hover:border-[#1a84de]/50"
                autoComplete="off"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {isCountryListOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                  {countries
                    .filter(country => 
                      country.toLowerCase().includes(currentLocationInput.toLowerCase()) &&
                      !formData.location.includes(country)
                    )
                    .map((country, index) => (
                      <div
                        key={country}
                        onClick={() => handleAddLocation(country)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`px-4 py-2 cursor-pointer transition-colors duration-200 ${
                          index === highlightedIndex 
                            ? 'bg-[#1a84de] text-white' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {country}
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            {/* Selected Locations Tags */}
            {formData.location.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.location.map((location, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#0958d9]/10 text-[#0958d9] border border-[#0958d9]/20 group transition-all duration-200"
                  >
                    {location}
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(location)}
                      className="ml-2 text-[#1a84de] hover:text-blue-800 focus:outline-none transition-colors duration-200 flex items-center"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
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
              disabled={!!editingData} // Make read-only when editing
              placeholder="e.g., Senior Frontend Developer"
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1a84de] focus:border-[#1a84de] outline-none transition-all duration-300 placeholder-gray-400 hover:border-[#1a84de]/50 ${
                editingData ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1a84de] focus:border-[#1a84de] outline-none transition-all duration-300 hover:border-[#1a84de]/50 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjsfk0JyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10"
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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1a84de] focus:border-[#1a84de] outline-none transition-all duration-300 placeholder-gray-400 hover:border-[#1a84de]/50"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-6 py-3 bg-[#1a84de] text-white font-medium rounded-xl hover:bg-[#24AC4A] focus:outline-none focus:ring-2 focus:ring-[#1a84de] focus:ring-offset-2 transition-all duration-300 whitespace-nowrap flex items-center gap-2 justify-center"
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
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#0958d9]/10 text-[#0958d9] border border-[#0958d9]/20 group transition-all duration-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-[#1a84de] hover:text-blue-800 focus:outline-none transition-colors duration-200 flex items-center"
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
                <div className={`w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-300 group-hover:border-[#1a84de] ${formData.hiringUrgency === urgency.toLowerCase() ? 'border-[#1a84de] bg-[#1a84de]' : ''}`}>
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
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#1a84de]">{urgency}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl focus:outline-none transition-all duration-300 flex items-center gap-2"
          >
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#1a84de] hover:bg-[#24AC4A] text-white font-semibold rounded-xl focus:outline-none transition-all duration-300 flex items-center gap-2"
          >
            <span>{editingData ? 'Update' : 'Submit'} Job Info</span>
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
export default function LeadsGenerationPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState("jobs");
  const [submittedData, setSubmittedData] = useState([]);
  const [credits, setCredits] = useState(0);

  // Fetch credits from subscription
  const fetchCredits = useCallback(async () => {
    if (user && isAuthenticated) {
      try {
        const sub = await import("@/lib/subscription");
        const subData = await sub.getCurrentSubscription(user.id);
        setCredits(subData?.credits?.total || 0);
      } catch (error) {
        console.error('Error fetching credits:', error);
        setCredits(0);
      }
    }
  }, [user, isAuthenticated]);

  // Listen for credits updates
  useEffect(() => {
    const handleCreditsUpdate = () => {
      fetchCredits();
    };

    window.addEventListener('creditsUpdated', handleCreditsUpdate);
    return () => {
      window.removeEventListener('creditsUpdated', handleCreditsUpdate);
    };
  }, [fetchCredits]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);
  const [showForm, setShowForm] = useState(false); // Changed to false - show data table first
  const [editingEntry, setEditingEntry] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Helper function to show success message
  const showSuccessMessage = useCallback((message) => {
    setSuccessMessage(message);
    setErrorMessage("");
    setTimeout(() => setSuccessMessage(""), 4000);
  }, []);

  // Helper function to show error message
  const showErrorMessage = useCallback((message) => {
    setErrorMessage(message);
    setSuccessMessage("");
    setTimeout(() => setErrorMessage(""), 4000);
  }, []);

  // Function to load data from backend
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Load both jobs and industry data
      const [jobsResponse, industryResponse] = await Promise.all([
        fetch(`${apiBaseUrl}/lead-generation-job?userId=${user.id}`),
        fetch(`${apiBaseUrl}/lead-generation-industry?userId=${user.id}`)
      ]);
      
      const jobsData = await jobsResponse.json();
      const industryData = await industryResponse.json();
      
      if (jobsData.success && industryData.success) {
        // Transform backend data to match frontend format
        const transformedJobs = jobsData.data.map((job, index) => ({
          id: job.id,
          no: index + 1,
          type: 'jobs',
          jobTitle: job.jobTitle,
          industryType: job.industryType,
          companySize: job.companySize,
          workType: job.workType,
          location: typeof job.location === 'string' ? job.location.split(',') : job.location || [],
          experience: job.experience,
          skills: job.skills || [],
          hiringUrgency: job.hiringUrgency,
          submittedAt: new Date(job.createdAt).toLocaleDateString(),
          ...job
        }));
        
        const transformedIndustry = industryData.data.map((industry, index) => ({
          id: industry.id,
          no: index + 1,
          type: 'industry',
          industryType: industry.industryType,
          companySize: industry.companySize,
          cityCountry: typeof industry.cityCountry === 'string' ? industry.cityCountry.split(',') : industry.cityCountry || [],
          leadPriority: industry.leadPriority,
          submittedAt: new Date(industry.createdAt).toLocaleDateString(),
          ...industry
        }));
        
        setSubmittedData([...transformedJobs, ...transformedIndustry]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showErrorMessage('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, showErrorMessage]);

  // Load data on component mount
  useEffect(() => {
    if (user && isAuthenticated && !authLoading) {
      loadData();
    }
  }, [user, isAuthenticated, authLoading, loadData]);

  // Function to handle form submissions
  const handleFormSubmit = useCallback(async (formData, formType) => {
    if (!user) {
      showErrorMessage('Please log in to continue');
      return;
    }

    try {
      setLoading(true);
      
      const dataToSubmit = {
        ...formData,
        userId: user.id
      };

      // Convert arrays to strings for backend storage
      if (formType === 'jobs') {
        dataToSubmit.location = Array.isArray(formData.location) ? formData.location.join(',') : formData.location;
      } else if (formType === 'industry') {
        dataToSubmit.cityCountry = Array.isArray(formData.cityCountry) ? formData.cityCountry.join(',') : formData.cityCountry;
      }

      let response;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      if (editingEntry) {
        // Update existing entry
        const endpoint = formType === 'jobs' ? 
          `${apiBaseUrl}/lead-generation-job/${editingEntry.id}` : 
          `${apiBaseUrl}/lead-generation-industry/${editingEntry.id}`;
          
        response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSubmit),
        });
      } else {
        // Create new entry
        const endpoint = formType === 'jobs' ? 
          `${apiBaseUrl}/lead-generation-job` : 
          `${apiBaseUrl}/lead-generation-industry`;
          
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSubmit),
        });
      }

      const result = await response.json();
      
      if (result.success) {
        const message = editingEntry ? 
          `${formType === 'jobs' ? 'Job' : 'Industry'} entry updated successfully!` : 
          `${formType === 'jobs' ? 'Job' : 'Industry'} entry created successfully!`;
        showSuccessMessage(message);
        setShowForm(false);
        setEditingEntry(null);
        await loadData(); // Reload data from backend
        await fetchCredits(); // Immediately update credits after successful add/edit
      } else {
        showErrorMessage(result.message || 'Failed to save entry');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showErrorMessage('Failed to save entry. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, editingEntry, showSuccessMessage, showErrorMessage, loadData, fetchCredits]);

  // Function to handle edit
  const handleEdit = useCallback((entry) => {
    setEditingEntry(entry);
    setSelected(entry.type);
    setShowForm(true);
  }, [showErrorMessage]);

  // Function to handle delete
  const handleDelete = useCallback(async (entry) => {
    setEntryToDelete(entry);
    setIsDeleteDialogOpen(true);
  }, []);

  // Function to confirm delete
  const confirmDelete = useCallback(async () => {
    if (!entryToDelete) return;

    try {
      setLoading(true);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const endpoint = entryToDelete.type === 'jobs' ? 
        `${apiBaseUrl}/lead-generation-job/${entryToDelete.id}` : 
        `${apiBaseUrl}/lead-generation-industry/${entryToDelete.id}`;
        
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        showSuccessMessage(`${entryToDelete.type === 'jobs' ? 'Job' : 'Industry'} entry deleted successfully!`);
        await loadData(); // Reload data from backend
      } else {
        showErrorMessage(result.message || 'Failed to delete entry');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      showErrorMessage('Failed to delete entry. Please try again.');
    } finally {
      setLoading(false);
      setEntryToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  }, [entryToDelete, showSuccessMessage, showErrorMessage, loadData]);

  // Function to cancel delete
  const cancelDelete = useCallback(() => {
    setEntryToDelete(null);
    setIsDeleteDialogOpen(false);
  }, []);

  // Make functions available globally for column actions
  useEffect(() => {
    window.handleEditRole = handleEdit;
    window.handleDeleteRole = handleDelete;
    
    return () => {
      delete window.handleEditRole;
      delete window.handleDeleteRole;
    };
  }, [handleEdit, handleDelete]);

  // Filter data based on type
  const jobsData = submittedData.filter(entry => entry.type === 'jobs');
  const industryData = submittedData.filter(entry => entry.type === 'industry');

  useEffect(() => {
    // Remove the simulated data loading since we now load from backend
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-0 via-white to-green-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a84de] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-0 via-white to-green-50 p-4 sm:p-6 animate-fadeIn">
      {/* Delete Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
          <div className="mx-4 max-w-md rounded-xl bg-white/95 backdrop-blur-sm p-6 shadow-2xl border border-gray-200/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Delete Entry
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this {entryToDelete?.type === 'jobs' ? 'job' : 'industry'} entry? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-800">Lead Generation</h1>
          <div className="mt-2 text-lg font-semibold text-gray-700">
            Credits Remaining: <span className={credits === 0 ? "text-red-600" : "text-green-600"}>{credits}</span>
          </div>
        </div>
        {user && (
          <button
            onClick={() => {
              if (credits <= 0) {
                showErrorMessage("You don't have enough credits to add new leads. Please purchase more credits.");
                return;
              }
              setShowForm(true);
              setEditingEntry(null);
            }}
            className={`px-6 py-3 bg-[#1a84de] hover:bg-[#24AC4A] text-white font-semibold rounded-xl focus:outline-none transition-all duration-300 flex items-center gap-2 ${credits === 0 ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''}`}
            disabled={credits === 0}
          >
            <span>Add New Lead</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl animate-slideUpFade">
          <div className="flex items-center justify-between">
            <span>{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage("")}
              className="text-green-700 hover:text-green-900 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl animate-slideUpFade">
          <div className="flex items-center justify-between">
            <span>{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage("")}
              className="text-red-700 hover:text-red-900 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showForm && user && (
        <div className="mb-8">
          {/* Toggle Buttons */}
          <div className="mx-auto mb-8 flex w-full max-w-md overflow-hidden rounded-xl border border-gray-300 shadow-md bg-white animate-slideUpFade hover:shadow-lg transition-all duration-500">
            <button
              onClick={() => setSelected("jobs")}
              className={`w-1/2 px-6 py-4 text-center font-bold transition-all duration-300 ${
                selected === "jobs"
                  ? "bg-gradient-to-r from-[#1a84de] to-[#1a84de] text-white shadow-inner"
                  : "bg-white text-gray-700"
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => setSelected("industry")}
              className={`w-1/2 px-6 py-4 text-center font-bold transition-all duration-300 ${
                selected === "industry"
                  ? "bg-gradient-to-r from-[#1a84de] to-[#1a84de] text-white shadow-inner"
                  : "bg-white text-gray-700"
              }`}
            >
              Industry
            </button>
          </div>

          {/* Form Container with Transition */}
          <div className="transition-all duration-500 ease-in-out perspective-1000">
            {selected === "jobs" && (
              <div className="opacity-100 transform transition-all duration-500 animate-slideUpFade">
                <div className="animate-float">
                  <JobsForm 
                    onSubmit={(data) => handleFormSubmit(data, 'jobs')}
                    editingData={editingEntry && editingEntry.type === 'jobs' ? editingEntry : null}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingEntry(null);
                    }}
                    onError={showErrorMessage}
                  />
                </div>
              </div>
            )}
            {selected === "industry" && (
              <div className="opacity-100 transform transition-all duration-500 animate-slideUpFade">
                <div className="animate-float">
                  <IndustryForm 
                    onSubmit={(data) => handleFormSubmit(data, 'industry')}
                    editingData={editingEntry && editingEntry.type === 'industry' ? editingEntry : null}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingEntry(null);
                    }}
                    onError={showErrorMessage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Data Tables */}
      {submittedData.length > 0 && (
        <div className="space-y-8">
          {/* Jobs Table */}
          {jobsData.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Jobs Submissions</h2>
              <DataTable columns={jobsColumns} data={jobsData} />
            </div>
          )}

          {/* Industry Table */}
          {industryData.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Industry Submissions</h2>
              <DataTable columns={industryColumns} data={industryData} />
            </div>
          )}
        </div>
      )}

      {submittedData.length === 0 && !showForm && user && (
        <div className="text-center py-12">
          <div className="mb-2 text-lg font-semibold text-gray-700">
            Credits Remaining: <span className={credits === 0 ? "text-red-600" : "text-green-600"}>{credits}</span>
          </div>
          <div className="text-gray-500 text-lg mb-4">No submissions yet</div>
          <button
            onClick={() => {
              if (credits <= 0) {
                showErrorMessage("You don't have enough credits to create leads. Please purchase more credits.");
                return;
              }
              setShowForm(true);
              setEditingEntry(null); // Clear editing state when adding new entry
            }}
            className={`px-6 py-3 bg-[#1a84de] hover:bg-[#24AC4A] text-white font-semibold rounded-xl focus:outline-none transition-all duration-300 ${credits === 0 ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''}`}
            disabled={credits === 0}
          >
            Create Your First Lead
          </button>
        </div>
      )}

      {!user && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Please log in to access Lead Generation</div>
          <a 
            href="/login"
            className="px-6 py-3 bg-[#1a84de] hover:bg-[#24AC4A] text-white font-semibold rounded-xl focus:outline-none transition-all duration-300 inline-block"
          >
            Login
          </a>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
