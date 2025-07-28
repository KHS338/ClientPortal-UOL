"use client"

// Test file to check backend connectivity
export default function TestConnection() {
  const testConnection = async () => {
    try {
      console.log('Testing connection to:', `${process.env.NEXT_PUBLIC_API_URL}/test-connection`);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/test-connection`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Connection successful:', data);
        alert(`Connection successful! ${JSON.stringify(data)}`);
      } else {
        console.error('Connection failed:', response.status, response.statusText);
        alert(`Connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Backend Connection Test</h1>
      <button 
        onClick={testConnection}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Backend Connection
      </button>
      <p>API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
    </div>
  );
}
