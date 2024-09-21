import React, { useState } from 'react';
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom"


const SignUp = () => {
    // State for managing form fields
    const [isLogin, setIsLogin] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsLogin(!isLogin);
        resetForm(); // Reset form fields when switching between Login and Sign-Up
    };

    // Handle form submission for Sign-Up and Login
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (isLogin) {
                const body = { email, password };
                const response = await axios.post("http://localhost:3000/login", body);
                if (response.data.success) {
                    localStorage.setItem("token", response.data.token);
                    navigate("/option");
                }
            } else {
                const body = { name, email, password };
                const response = await axios.post("http://localhost:3000/signup", body);
                if (response.data.success) {
                    localStorage.setItem("token", response.data.token);
                    navigate("/option");
                }
            }
            resetForm();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const handleGoogle = () => {
        console.log("Google sign-in/up initiated");
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // Replace with your Google Client ID
        const redirectUri = 'http://localhost:3000/auth/google/callback'; // Your redirect URI
        const scope = 'email profile';
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl;
    };

    // Reset form fields
    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 mx-12">
                <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* Show name field only for sign-up */}
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-600">Name</label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-600">Password</label>
                        <input
                            type="password"
                            placeholder="Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-300 mb-4"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                {/* Google Sign-In Button */}
                <button
                    className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg text-gray-700 transition duration-300 mb-4 hover:bg-gray-300"
                    onClick={handleGoogle}
                >
                    <FaGoogle className="mr-2" /> {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                </button>

                <div className="mt-4 text-center">
                    <button
                        className="text-indigo-500 hover:text-indigo-600 focus:outline-none transition"
                        onClick={toggleForm}
                    >
                        {isLogin
                            ? "Don't have an account? Sign Up"
                            : 'Already have an account? Login'}
                    </button>
                </div>

                {/* Back Button */}
                <div className="mt-4 text-center w-full">
                    <button
                        className="text-white px-3 py-2 rounded-md bg-gray-700 hover:text-gray-800 focus:outline-none transition"
                        onClick={() => navigate('/')}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
