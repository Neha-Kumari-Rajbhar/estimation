
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { motion } from 'framer-motion';

const UserSignup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { user, setUser } = React.useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
    if (response.status === 201) {
      const data = response.data;
      
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/home');
    }

    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-blue-700 to-green-500">
      {/* Floating Elements */}
      <motion.div className="absolute top-10 left-10 w-24 h-24 bg-purple-600 rounded-full opacity-60" animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-20 right-10 w-32 h-32 bg-green-500 rounded-full opacity-60" animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
      
      {/* Signup Form */}
      <div className="m-10 relative flex flex-col bg-white bg-opacity-10 backdrop-blur-md shadow-lg rounded-lg overflow-hidden p-6 md:p-10 w-full max-w-lg">
        <img className="w-24 mx-auto mb-2" src="../public/logo.png" alt="Logo" />
        <h3 className="text-2xl font-semibold text-center text-gray-800">Create an Account</h3>
        
        <form onSubmit={submitHandler} className="flex flex-col mt-5">
          <label className='block text-lg mb-1'>First Name</label>
          <input type="text" placeholder="Your first name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
          
          <label className='block text-lg mb-1 mt-5'>Last Name</label>
          <input type="text" placeholder="Your last name" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
          
          <label className='block text-lg mb-1 mt-5'>Email</label>
          <input type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
          
          <label className='block text-lg mb-1 mt-5'>Password</label>
          <input type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
          
          <button type="submit" className="py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition mt-8">Signup</button>
        </form>
        
        <p className="text-center text-sm text-gray-900 mt-4">Already have an account? <Link to="/login" className="text-blue-900 font-semibold hover:underline">Login here</Link></p>
      </div>
      
      {/* Motion Div with Blurred Edge */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-blue-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400 rounded-full blur-3xl opacity-50 animate-bounce"></div>
    </div>
  );
};

export default UserSignup;

