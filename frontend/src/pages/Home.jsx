import React from 'react';
import Navbar from '../components/Navbar'; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom"

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex flex-col items-center justify-center py-16 px-4 md:px-8 lg:px-16">
                <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Welcome to Invoice Generator</h1>
                <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
                    Generate professional invoices quickly and easily with our intuitive invoice generator application.
                    Whether you're a freelancer, a small business owner, or a large corporation, our tool helps you create
                    and manage invoices efficiently, saving you time and ensuring accuracy in your billing process.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Features</h2>
                        <ul className="list-disc list-inside">
                            <li className="text-gray-700">Easy invoice creation with customizable templates</li>
                            <li className="text-gray-700">Add your logo and brand colors for a personalized touch</li>
                            <li className="text-gray-700">Track payment status and send reminders</li>
                            <li className="text-gray-700">Export invoices as PDF for easy sharing</li>
                            <li className="text-gray-700">Secure data storage and easy access from anywhere</li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
                        <p className="text-gray-700 mb-4">
                            Our application is designed with simplicity and efficiency in mind. You can generate invoices in
                            minutes, allowing you to focus on what matters most: your business.
                        </p>
                        <p className="text-gray-700">
                            With regular updates and dedicated support, we ensure that our users have the best possible
                            experience.
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <button className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300"
                        onClick={() => navigate('/register')}
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
