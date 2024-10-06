import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { invoiceAtom } from '../store/atom';
import { useSetRecoilState } from "recoil";

const InvoiceForm = () => {
    const navigate = useNavigate();
    const setInvoice = useSetRecoilState(invoiceAtom);
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://localhost:3000/getToken', {
                    withCredentials: true // This is important for sending cookies
                });
                if (response.data.success) {
                    if (response.data.token) {
                        localStorage.setItem('token', response.data.token);
                        setToken(response.data.token);
                    } else {
                        navigate('/');
                        console.log('Did not get the token');
                    }
                } else {
                    if (localStorage.getItem("token")) {
                        navigate("/option");
                    } else {
                        navigate("/");
                    }
                }
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };

        fetchToken();
    }, [navigate]);

    const [clientDetails, setClientDetails] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        gstNo: ''
    });

    const [invoiceItems, setInvoiceItems] = useState([{ description: '', baseAmount: 0, gstAmount: 0, totalAmount: 0 }]);
    const [invoiceNumber, setInvoiceNumber] = useState(''); // Dynamic invoice number
    const [invoiceDate, setInvoiceDate] = useState(''); // User-input invoice date

    const [clientNames, setClientNames] = useState([]);

    // Fetch client data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/client/get');
                if (response.data.success) {
                    const clients = response.data.data;
                    const names = clients.map(client => client.name);
                    setClientNames(names);
                }
            } catch (error) {
                console.error('Error fetching client data:', error);
            }
        };

        fetchData();
    }, []);

    const handleClientChange = (e) => {
        const { name, value } = e.target;
        setClientDetails(prevState => ({ ...prevState, [name]: value }));
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const updatedItems = [...invoiceItems];

        if (name === 'description') {
            // Handle description change separately
            updatedItems[index] = {
                ...updatedItems[index],
                description: value
            };
        } else if (name === 'baseAmount') {
            // Handle baseAmount and recalculate gstAmount and totalAmount
            const numericValue = parseFloat(value) || 0; // Convert to number or default to 0
            updatedItems[index] = {
                ...updatedItems[index],
                baseAmount: numericValue,
                gstAmount: (numericValue * 0.18), // Calculate GST
                totalAmount: (numericValue + (numericValue * 0.18)) // Calculate total amount
            };
        }

        setInvoiceItems(updatedItems);
    };


    const handleAddItem = () => {
        setInvoiceItems([...invoiceItems, { description: '', baseAmount: 0, gstAmount: 0, totalAmount: 0 }]);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = invoiceItems.filter((_, i) => i !== index);
        setInvoiceItems(updatedItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            invoiceNo: invoiceNumber, // Use dynamic invoice number
            name: clientDetails.name,
            address: clientDetails.address,
            phone: clientDetails.phone,
            date: invoiceDate || new Date().toISOString().split('T')[0], // Use current date if not set
            items: invoiceItems.map(item => ({
                description: item.description,
                totalAmount: item.totalAmount,
                gstAmount: item.gstAmount,
                baseAmount: item.baseAmount
            })),
            gstNo: clientDetails.gstNo,
            email: clientDetails.email,
        };

        try {
            // Submit the invoice
            const response = await axios.post("http://localhost:3000/invoice/add", formData);
            if (response.data.success) {
                console.log("Invoice added");
                setInvoice(formData);
                navigate('/check');
            } else {
                console.log("Failed to add invoice:", response.data.message);
            }
        } catch (error) {
            console.error("Error occurred while submitting:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-3xl mx-auto p-6 bg-blue-50 rounded-lg shadow-lg mt-10">
                <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Invoice Form</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Client Details Section */}
                        <div className="border p-4 rounded-lg bg-blue-100">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Client Details</h2>
                            <input
                                type="text"
                                name="name"
                                value={clientDetails.name}
                                onChange={handleClientChange}
                                list="clientNames"
                                placeholder="Client Name"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <datalist id="clientNames">
                                {clientNames.map((name, index) => (
                                    <option key={index} value={name} />
                                ))}
                            </datalist>
                            <input
                                type="text"
                                name="address"
                                value={clientDetails.address}
                                onChange={handleClientChange}
                                placeholder="Address"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="text"
                                name="phone"
                                value={clientDetails.phone}
                                onChange={handleClientChange}
                                placeholder="Phone"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="text"
                                name="gstNo"
                                value={clientDetails.gstNo}
                                onChange={handleClientChange}
                                placeholder="GST No"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                value={clientDetails.email}
                                onChange={handleClientChange}
                                placeholder="Email (optional)"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Invoice Details Section */}
                        <div className="border p-4 rounded-lg bg-blue-100">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Invoice Details</h2>
                            <input
                                type="text"
                                value={invoiceNumber}
                                onChange={(e) => setInvoiceNumber(e.target.value)}
                                placeholder="Invoice Number"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="date"
                                value={invoiceDate}
                                onChange={(e) => setInvoiceDate(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Invoice Items Section */}
                    <div className="border p-4 rounded-lg bg-blue-100">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Invoice Items</h2>
                        {invoiceItems.map((item, index) => (
                            <div key={index} className="space-y-4">
                                <input
                                    type="text"
                                    name="description"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, e)}
                                    placeholder="Item Description"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="number"
                                    name="baseAmount"
                                    value={item.baseAmount}
                                    onChange={(e) => handleItemChange(index, e)}
                                    placeholder="Base Amount"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {/* Display GST and Total Amount */}
                                <input
                                    type="text"
                                    value={item.gstAmount.toFixed(2)} // Format for display
                                    readOnly
                                    placeholder="GST Amount"
                                    className="w-full p-4 border border-gray-300 rounded-lg bg-gray-200"
                                />
                                <input
                                    type="text"
                                    value={item.totalAmount.toFixed(2)} // Format for display
                                    readOnly
                                    placeholder="Total Amount"
                                    className="w-full p-4 border border-gray-300 rounded-lg bg-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Remove Item
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 mt-4"
                        >
                            Add Item
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Submit Invoice
                    </button>
                </form>
            </div>
        </>
    );
};

export default InvoiceForm;
