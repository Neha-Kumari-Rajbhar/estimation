import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcSearch } from "react-icons/fc";
import Footer from './Footer';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext'; // Corrected context import

const Home = () => {
  const { user } = useContext(UserDataContext); // Get user from context
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // State for recent searches
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [errorRecent, setErrorRecent] = useState('');

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    // Effect for custom cursor
    const moveCursor = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    // Effect to fetch recent searches
    const fetchRecentSearches = async () => {
      if (!user || !user._id) { // This check is fine, acts as a safeguard.
        setIsLoadingRecent(false);
        return;
      }

      try {
        const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'; // Define BASE_URL
        const response = await axios.get(`${BASE_URL}/api/recent-searches/${user._id}`);
        setRecentSearches(response.data);
      } catch (err) {
        console.error('Error fetching recent searches:', err);
        setErrorRecent('Failed to load recent searches.');
      } finally {
        setIsLoadingRecent(false);
      }
    };

    fetchRecentSearches();
  }, [user]); // Re-run this effect when the user object changes (e.g., after login)

  return (
    <div>
      <div className="bg-gray-900 text-white min-h-screen font-sans relative overflow-hidden">
        {/* Custom Cursor */}
        <div
          className="cursor fixed w-8 h-8 rounded-full bg-white opacity-20 pointer-events-none transform transition-transform duration-200 ease-out"
          style={{ transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)` }}
        ></div>

        {/* Navbar */}
        <nav className="flex justify-between items-center p-2 bg-transparent backdrop-blur-lg shadow-2xl fixed w-full top-0 left-0 z-50">
          <div className="text-2xl font-bold text-blue-500">
            {/* Using placeholder image, replace with your actual logo path */}
            <img className="w-20 h-20 md:w-20 md:h-20 object-contain" src="/logo.png" alt="Logo" />
          </div>
          <div className="relative">
            
            <button onClick={toggleDropdown} className="text-xl">
              <img src={user?.profilePic || "/profile-icon.png"} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                <ul className="text-gray-200">
                 
                  <li><Link to="/search-history" className="block px-4 py-2 hover:bg-gray-700">Search History</Link></li>
                  
                  <li><button onClick={() => navigate('/user/logout')} className="block w-full text-left px-4 py-2 hover:bg-gray-700">Logout</button></li>
                </ul>
              </div>
            )}
          </div>
        </nav>

        {/* Main Section with Tailwind Animations */}
        <section className="mt-0 bg-gradient-to-br from-blue-900 via-pink-900 to-purple-900 pb-8 pt-36 py-10 text-center animate-fadeIn">
          <h1 className="text-5xl font-bold text-white leading-none tracking-tighter">Welcome to Our Platform</h1>
          <p className="mt-3 text-sm text-gray-300">Find the most accurate cost predictions and improve your procurement strategy.</p>

          <div className="mt-10 flex justify-center">
            <Link to="/search">
              <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white tracking-widest font-mono text-lg py-3 px-8 rounded-full shadow-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 ease-in-out">
                SEARCH <FcSearch size={30} />
              </button>
            </Link>
          </div>
        </section>

        {/* Recent Search Section - Updated to fetch and display data */}
        <section className="py-10 bg-gray-800 transition-transform duration-700 ease-in-out transform hover:scale-105">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-white mb-5">Recent Searches</h2>
            {isLoadingRecent ? (
              <p className="text-gray-400 text-center">Loading recent searches...</p>
            ) : errorRecent ? (
              <p className="text-red-500 text-center">{errorRecent}</p>
            ) : recentSearches.length === 0 ? (
              <p className="text-gray-400 text-center">No recent searches found. <Link to="/search" className="text-blue-400 hover:underline">Start your first search!</Link></p>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center">
                {recentSearches.map((item) => (
                  <div key={item._id} className="bg-gray-700 p-4 rounded-lg shadow-lg text-white w-full sm:w-5/12 md:w-1/3 lg:w-1/4 xl:w-1/5 hover:scale-105 transition-transform duration-500 flex flex-col">
                    <p className="text-sm text-gray-400 mb-2">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <h3 className="text-xl font-semibold text-blue-300 mb-2 truncate">
                      {item.productType === "ExactMakeModel" && `Item: ${item.formData.name}`}
                      {item.productType === "RelevantSpecifications" && `Item: ${item.formData.name}`}
                      {item.productType === "BasicRequirements" && `Service: ${item.formData.name}`}
                    </h3>
                    <p className="text-sm text-gray-300 mb-2 flex-grow">
                      Query: <span className="font-light">{item.searchQuery.substring(0, 70)}{item.searchQuery.length > 70 ? '...' : ''}</span>
                    </p>
                    <p className="text-md text-green-300 font-medium">
                      Estimate: <span className="font-normal">{item.estimationResult.split('\n')[0].substring(0, 50)}{item.estimationResult.split('\n')[0].length > 50 ? '...' : ''}</span>
                    </p>
                    <Link to="/search-history" className="text-blue-400 text-sm hover:underline mt-3 self-end">
                      View All History
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="py-10 bg-gray-900 transition-transform duration-700 ease-in-out transform hover:scale-105">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-semibold text-white mb-5">About Us</h2>
            <div className="flex flex-wrap gap-6 justify-center">

              <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full sm:w-1/2 lg:w-1/3 hover:rotate-3 hover:scale-105 transition-transform duration-500">
                <img
                  src="https://cdn-icons-png.freepik.com/512/7156/7156578.png"
                  alt="Our Mission"
                  className="w-20 h-20 mb-4 rounded-full mx-auto"
                />
                <h2 className="text-xl text-blue-400 text-center">
                  Our Mission
                </h2>
                <p className="text-gray-500 text-sm text-center mt-2">
                  To empower individuals and organizations to achieve their highest potential through world-class services and solutions
                </p>
              </div>


              <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full sm:w-1/2 lg:w-1/3 hover:rotate-3 hover:scale-105 transition-transform duration-500">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1465/1465429.png"
                  alt="Our Vision"
                  className="w-20 h-20 mb-4 rounded-full mx-auto"
                />
                <h2 className="text-xl text-blue-400 text-center">
                  Our Vision
                </h2>
                <p className="text-gray-500 text-sm text-center mt-2">
                  To be a global leader recognized for innovation and quality.
                </p>
              </div>


              <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full sm:w-1/2 lg:w-1/3 hover:rotate-3 hover:scale-105 transition-transform duration-500">
                <img
                  src="https://icons.veryicon.com/png/o/education-technology/management-icon/value-6.png"
                  alt="Our Values"
                  className="w-20 h-20 mb-4 rounded-full mx-auto"
                />
                <h2 className="text-xl text-blue-400 text-center">
                  Our Values
                </h2>
                <p className="text-gray-500 text-sm text-center mt-2">
                  Integrity, Excellence, and Innovation are at the heart of everything we do.
                </p>
              </div>


              <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full sm:w-1/2 lg:w-1/3 hover:rotate-3 hover:scale-105 transition-transform duration-500">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/5065/5065337.png"
                  alt="Our Team"
                  className="w-20 h-20 mb-4 rounded-full mx-auto"
                />
                <h2 className="text-xl text-blue-400 text-center">
                  Our Team
                </h2>
                <p className="text-gray-500 text-sm text-center mt-2">
                  A passionate group of individuals working together to create a better future.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className=' w-full overflow-hidden'>
        <Footer />
      </div>
    </div>
  );
};

export default Home;