import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { viewAtom } from '../store/atom';
import { useNavigate } from 'react-router-dom';

const UpdateForm = () => {
    const invoiceData = useRecoilValue(viewAtom);
    const [updatedValues, setUpdatedValues] = useState({});
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupSuccess, setPopupSuccess] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate(); // Initialize useNavigate
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            invoiceNo: invoiceData.invoiceNo,
            changes: {
                ...updatedValues,
            },
        };

        try {
            const response = await axios.put(`http://localhost:3000/invoice/update`, updatedData);
            if (response.data.success) {
                setPopupMessage('Your invoice has been updated successfully.');
                setPopupSuccess(true);
                setTimeout(() => {
                    setPopupVisible(false);
                    navigate('/option'); // Redirect after success
                }, 1500); // Redirect after 3 seconds
            } else {
                setPopupMessage('Failed to update the invoice.');
                setPopupSuccess(false);
            }
        } catch (error) {
            setPopupMessage('Error occurred while updating.');
            setPopupSuccess(false);
        }

        setPopupVisible(true);
        setTimeout(() => setPopupVisible(false), 3000);
    };

    const tableFields = [
        'invoiceNo',
        'name',
        'address',
        'phone',
        'email',
        'gstNo',
        'baseAmount',
        'date',
        'description'
    ];

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto p-8 bg-gray-100 rounded-lg shadow-xl mt-10">
                <h1 className="text-5xl font-extrabold mb-10 text-[#E85523] text-center">Update Invoice</h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-lg">
                            <thead className="bg-gradient-to-r from-[#E85523] to-orange-400 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-lg font-bold">Field</th>
                                    <th className="px-6 py-4 text-left text-lg font-bold">Current Value</th>
                                    <th className="px-6 py-4 text-left text-lg font-bold">New Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {tableFields.map((key) => (
                                    <tr key={key} className="bg-gray-50 hover:bg-gray-100 transition duration-300">
                                        <td className="px-6 py-4 font-medium capitalize text-gray-800">{key}</td>
                                        <td className="px-6 py-4 text-gray-600">{invoiceData[key] || "N/A"}</td>
                                        <td className="px-6 py-4">
                                            <input
                                                type={key === "date" ? "date" : "text"}
                                                name={key}
                                                placeholder={`Update ${key}`}
                                                onChange={handleInputChange}
                                                value={updatedValues[key] || ''}
                                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                disabled={key === 'invoiceNo'}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            type="submit"
                            className="px-10 py-4 bg-gradient-to-r from-[#E85523] to-orange-400 text-white font-semibold rounded-full shadow-lg hover:bg-orange-600 transition duration-300"
                        >
                            Update Invoice
                        </button>
                    </div>
                </form>

                {/* Popup notification */}
                {popupVisible && (
                    <div className={`fixed top-10 right-10 p-4 rounded-lg shadow-lg transition-all duration-300 ${popupSuccess ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        <p>{popupMessage}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default UpdateForm;
