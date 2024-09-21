import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { FaRegFileAlt, FaPencilAlt } from 'react-icons/fa';

const Option = () => {
    const [token, setToken] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://localhost:3000/getToken', {
                    withCredentials: true // This is important for sending cookies
                })
                if (response.data.success) {
                    if (response.data.success != undefined && response.data.token != null) {
                        localStorage.setItem('token', response.data.token);
                        setToken(response.data.token);
                    } else {
                        navigate('/');
                        console.log('Did not get the token');
                    }
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };

        fetchToken(); // Call the async function
    }, []);


    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto py-12">
                <h1 className="text-4xl font-semibold text-center text-gray-800 mb-10">
                    Options
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
                    <div className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                        <div className="p-6 flex flex-col items-center">
                            <div className="w-16 h-16 bg-green-200 text-green-700 rounded-full flex items-center justify-center mb-4">
                                <FaRegFileAlt className="w-10 h-10 hover:scale-110 transition-transform duration-300 ease-in-out" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                Create Invoice
                            </h2>
                            <p className="text-gray-500 text-center">
                                Start a new invoice by adding items, customers, and payment details.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                        <div className="p-6 flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center mb-4">
                                <FaPencilAlt className="w-10 h-10 hover:scale-110 transition-transform duration-300 ease-in-out" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                Edit/View Invoice
                            </h2>
                            <p className="text-gray-500 text-center">
                                View or modify existing invoices and track payments efficiently.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Option;
