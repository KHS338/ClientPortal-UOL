"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PrequalificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.roleId;

  const [role, setRole] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (roleId) {
      fetchRoleDetails();
      fetchResults();
    }
  }, [roleId]);

  const fetchRoleDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prequalification/${roleId}`);
      if (response.ok) {
        const data = await response.json();
        setRole(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prequalification/${roleId}/results`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      disqualified: 'bg-red-100 text-red-800',
      'in-review': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading prequalification details...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Prequalification Roles
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Prequalification Details: {role?.roleTitle}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <span className="font-semibold">Priority:</span> {role?.rolePriority}
            </div>
            <div>
              <span className="font-semibold">Location:</span> {role?.location}
            </div>
            <div>
              <span className="font-semibold">Industry:</span> {role?.industry}
            </div>
            <div>
              <span className="font-semibold">Experience:</span> {role?.experienceRequired}
            </div>
            <div>
              <span className="font-semibold">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                role?.status === 'queued' ? 'bg-gray-100 text-gray-800' :
                role?.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {role?.status?.charAt(0).toUpperCase() + role?.status?.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prequalification Results */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Assessment Results ({results.length})
          </h2>
        </div>
        
        {results.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No assessment results found for this role yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {result.candidateName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.candidateEmail}</div>
                      <div className="text-sm text-gray-500">{result.candidatePhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {result.qualificationScore}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {result.assessmentSummary}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a
                        href={result.assessmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Assessment
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
