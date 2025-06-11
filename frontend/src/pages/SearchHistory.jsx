import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext'; // Corrected context import

const SearchHistory = () => {
  const { user } = useContext(UserDataContext);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      // Assuming UserProtectWrapper ensures user is logged in
      // If user._id is not immediately available, you might need a small delay
      // or ensure your UserContext correctly sets it.
      if (!user || !user._id) {
        setError('User not logged in or user ID not available.');
        setIsLoading(false);
        return;
      }

      try {
        const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'; // Define BASE_URL
        const response = await axios.get(`${BASE_URL}/api/history/${user._id}`);
        setHistory(response.data);
      } catch (err) {
        console.error('Error fetching search history:', err);
        setError('Failed to load search history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]); // Re-fetch when user object changes

  if (isLoading) {
    return <div className="text-center mt-8 text-gray-600">Loading search history...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  if (history.length === 0) {
    return <div className="text-center mt-8 text-gray-600">No search history found. Start searching!</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Search History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div key={item._id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm text-gray-500 mb-2">
                Date: {new Date(item.createdAt).toLocaleString()}
              </p>
              <p className="text-md font-semibold text-gray-800 mb-2">
                Product Type: <span className="font-normal text-blue-700">{item.productType}</span>
              </p>
              <p className="text-md font-semibold text-gray-800 mb-2">
                Query: <span className="font-normal text-gray-700">{item.searchQuery.substring(0, 100)}{item.searchQuery.length > 100 ? '...' : ''}</span>
              </p>
              <p className="text-md font-semibold text-gray-800 mb-2">
                Currency: <span className="font-normal text-green-700">{item.currencyUsed}</span>
              </p>
              <div className="bg-gray-50 p-3 rounded-md mt-3">
                <h5 className="font-medium text-gray-700 mb-1">Estimation Result:</h5>
                <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans max-h-32 overflow-y-auto">
                  {item.estimationResult}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchHistory;
