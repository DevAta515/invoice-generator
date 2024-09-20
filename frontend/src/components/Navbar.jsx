import React from 'react';
import { useNavigate } from "react-router-dom"
const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Phoenix Technosoft</h1>
                <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
                    onClick={() => navigate('/register')}
                >
                    Sign Up
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
