import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-9xl font-bold text-red-500">403</h1>
        <h2 className="text-3xl font-semibold mt-4 text-gray-800">Unauthorized Access</h2>
        <p className="mt-2 text-lg text-gray-600">
          Oops! You don't have permission to view this page.
        </p>
        <button
          onClick={handleGoBack}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
