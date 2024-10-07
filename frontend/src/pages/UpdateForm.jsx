import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { viewAtom, invoiceAtom } from '../store/atom';
import { useNavigate } from 'react-router-dom';

const UpdateForm = () => {
    const invoiceData = useRecoilValue(viewAtom); // Get the current invoice data from Recoil
    const setInvoice = useSetRecoilState(invoiceAtom);
    const [updatedValues, setUpdatedValues] = useState(invoiceData || {});
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupSuccess, setPopupSuccess] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://localhost:3000/getToken', {
                    withCredentials: true // This is important for sending cookies
                });
                if (response.data.success && response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    setToken(response.data.token);
                } else {
                    navigate('/');
                    console.log('Did not get the token');
                }
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };

        fetchToken();
    }, [navigate]);

    const handleInputChange = (e, index = null) => {
        const { name, value } = e.target;
        const gstRate = 0.18; // Assume GST rate is 18%

        if (index !== null) {
            // Update values within items array
            const updatedItems = [...updatedValues.items];
            updatedItems[index] = { ...updatedItems[index], [name]: value };

            // If baseAmount changes, update gstAmount and totalAmount
            if (name === "baseAmount") {
                const baseAmount = parseFloat(value) || 0;
                const gstAmount = baseAmount * gstRate;
                const totalAmount = baseAmount + gstAmount;

                updatedItems[index] = {
                    ...updatedItems[index],
                    gstAmount: gstAmount.toFixed(2),
                    totalAmount: totalAmount.toFixed(2)
                };
            }

            setUpdatedValues(prevState => ({
                ...prevState,
                items: updatedItems
            }));
        } else {
            // Update non-item fields
            setUpdatedValues(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send the entire form data as updatedData
        const updatedData = {
            ...updatedValues, // Spread the entire updatedValues object as the updated body
        };

        try {
            const response = await axios.put(`http://localhost:3000/invoice/update`, updatedData);
            if (response.data.success) {
                setPopupMessage('Your invoice has been updated successfully.');
                setPopupSuccess(true);
                setTimeout(() => {
                    setPopupVisible(false);
                    setInvoice(updatedData)
                    navigate('/check');
                }, 1500);
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
    const handleWheel = (e) => {
        e.target.blur();
    };

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
                                {/* Display main invoice details */}
                                {['invoiceNo', 'name', 'address', 'phone', 'email', 'gstNo', 'date'].map((key) => (
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

                                {/* Display items in the invoice */}
                                {updatedValues.items && updatedValues.items.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <tr className="bg-gray-50 hover:bg-gray-100 transition duration-300">
                                            <td className="px-6 py-4 font-medium capitalize text-gray-800">Item {index + 1} - Description</td>
                                            <td className="px-6 py-4 text-gray-600">{item.description || "N/A"}</td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text"
                                                    name="description"
                                                    placeholder="Update description"
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    value={item.description || ''}
                                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            </td>
                                        </tr>
                                        <tr className="bg-gray-50 hover:bg-gray-100 transition duration-300">
                                            <td className="px-6 py-4 font-medium capitalize text-gray-800">Base Amount</td>
                                            <td className="px-6 py-4 text-gray-600">{item.baseAmount}</td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    name="baseAmount"
                                                    placeholder="Update base amount"
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    value={item.baseAmount || ''}
                                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    onWheel={handleWheel}
                                                />
                                            </td>
                                        </tr>
                                        <tr className="bg-gray-50 hover:bg-gray-100 transition duration-300">
                                            <td className="px-6 py-4 font-medium capitalize text-gray-800">GST Amount</td>
                                            <td className="px-6 py-4 text-gray-600">{item.gstAmount}</td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    name="gstAmount"
                                                    placeholder="Update GST amount"
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    value={item.gstAmount || ''}
                                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    onWheel={handleWheel}
                                                />
                                            </td>
                                        </tr>
                                        <tr className="bg-gray-50 hover:bg-gray-100 transition duration-300">
                                            <td className="px-6 py-4 font-medium capitalize text-gray-800">Total Amount</td>
                                            <td className="px-6 py-4 text-gray-600">{item.totalAmount}</td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    name="totalAmount"
                                                    placeholder="Update total amount"
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    value={item.totalAmount || ''}
                                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    onWheel={handleWheel}
                                                />
                                            </td>
                                        </tr>
                                    </React.Fragment>
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
                    <div className={`fixed top-10 right-10 p-4 rounded-md shadow-md ${popupSuccess ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {popupMessage}
                    </div>
                )}
            </div>
        </>
    );
};

export default UpdateForm;
