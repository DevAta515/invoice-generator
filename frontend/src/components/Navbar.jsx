import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios"

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    });


    const handleLogout = async () => {
        const clearToken = async () => {
            try {
                const response = await axios.post('http://localhost:3000/clearToken', {}, { withCredentials: true });
                if (response.data.success) {
                    console.log("Token removed successfully");
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    navigate('/');
                }
            } catch (error) {
                console.error("Error clearing token:", error);
            }
        };

        // Call the clearToken function
        await clearToken();
    };


    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Phoenix Technosoft</h1>

                {isAuthenticated ? (
                    <button
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
                        onClick={handleLogout}
                    >
                        Log Out
                    </button>
                ) : (
                    <button
                        className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
                        onClick={() => navigate('/register')}
                    >
                        Sign Up
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
