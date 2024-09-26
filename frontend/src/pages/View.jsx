import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar"
import Invoice from '../components/Invoice';
import { useNavigate } from 'react-router-dom'


const View = () => {
    const [option, setOption] = useState('');  // 'name' or 'date'
    const [input, setInput] = useState('');    // User's input for name or date
    const [invoices, setInvoices] = useState([]); // Fetched invoices
    const [error, setError] = useState('');    // Error message
    const [loading, setLoading] = useState(false); // Loading state
    const [token, setToken] = useState(localStorage.getItem("token"));
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
                    if (localStorage.getItem("token")) {
                        navigate("/option")
                    } else {
                        navigate("/");
                    }
                }
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };

        fetchToken(); // Call the async function
    }, []);




    // Function to fetch invoices based on the selected option (name or date)
    const handleFetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await axios.post("http://localhost:3000/invoice/get", {
                option: option,
                input: input
            })
            setInvoices(response.data.data);
            setError('');
        } catch (err) {
            setError('Invoice Not Found');
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Heading for the page */}
            <Navbar></Navbar>
            <div className="container mx-auto mt-10 p-6">
                <h1 className="text-2xl font-bold text-gray-800">Invoice Fetcher</h1>

                {/* Main Content */}
                <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-6">Fetch Your Invoices</h2>

                {/* Selection Buttons */}
                <div className="flex justify-around mb-8">
                    <button
                        onClick={() => setOption('name')}
                        className={`px-4 py-2 rounded-lg text-white font-semibold ${option === 'name' ? 'bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'
                            }`}
                    >
                        Fetch by Name
                    </button>
                    <button
                        onClick={() => setOption('date')}
                        className={`px-4 py-2 rounded-lg text-white font-semibold ${option === 'date' ? 'bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'
                            }`}
                    >
                        Fetch by Date
                    </button>
                </div>

                {/* Input Field */}
                {option && (
                    <div className="flex flex-col items-center">
                        <input
                            type="text"
                            placeholder={option === 'name' ? 'Enter Name' : 'Enter Date (YYYY-MM-DD)'}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="mb-6 p-2 border border-gray-300 rounded-lg w-full max-w-lg"
                        />
                        <button
                            onClick={handleFetchInvoices}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg"
                        >
                            Fetch Invoices
                        </button>
                    </div>
                )}

                {/* Loading Indicator */}
                {loading && (
                    <div className="text-center mt-6 text-blue-600">
                        <p>Loading invoices...</p>
                    </div>
                )}

                {/* Error Message
                {error && (
                    <div className="text-center text-red-600 mt-6">
                        <p>{error}</p>
                    </div>
                )} */}

                {/* Display Fetched Invoices */}
                <div className="mt-10">
                    {invoices.length > 0 ? (
                        invoices.map((invoice, index) => <Invoice key={index} invoice={invoice} />)
                    ) : (
                        !loading && <p className="text-center text-gray-600">No invoices found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default View;
