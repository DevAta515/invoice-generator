import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { invoiceAtom } from '../store/atom';
import { useSetRecoilState } from "recoil"

const InvoiceForm = () => {
    const navigate = useNavigate();
    const setInvoice = useSetRecoilState(invoiceAtom);
    const [token, setToken] = useState(localStorage.getItem("token"));
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

    const [clientDetails, setClientDetails] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        gstNo: ''
    });

    const [invoiceDetails, setInvoiceDetails] = useState({
        baseAmount: 0,
        gstAmount: '',
        totalAmount: '',
        invoiceNo: '',
        date: '',
        description: ''
    });

    const [clientNames, setClientNames] = useState([]);
    const [clientAddresses, setClientAddresses] = useState([]);
    const [clientPhones, setClientPhones] = useState([]);
    const [clientEmails, setClientEmails] = useState([]);
    const [clientGstNos, setClientGstNos] = useState([]);

    // Fetch client data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/client/get');
                if (response.data.success) {
                    const clients = response.data.data;

                    // Extract the individual fields from the client objects
                    const names = clients.map(client => client.name);
                    const addresses = clients.map(client => client.address);
                    const phones = clients.map(client => client.phone);
                    const emails = clients.map(client => client.email);
                    const gstNos = clients.map(client => client.gstNo);

                    // Set state for each array
                    setClientNames(names);
                    setClientAddresses(addresses);
                    setClientPhones(phones);
                    setClientEmails(emails);
                    setClientGstNos(gstNos);
                }
            } catch (error) {
                console.error('Error fetching client data:', error);
            }
        };

        fetchData();
    }, []); // Fetch clients on mount

    // Set the date to today's date by default
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setInvoiceDetails(prevDetails => ({ ...prevDetails, date: today }));
    }, []);

    // Calculate GST (18%) and total whenever baseAmount changes
    useEffect(() => {
        if (invoiceDetails.baseAmount) {
            const baseAmount = parseFloat(invoiceDetails.baseAmount) || 0;
            const gstAmount = (baseAmount * 0.18).toFixed(2); // 18% GST
            const totalAmount = (baseAmount + parseFloat(gstAmount)).toFixed(2);
            setInvoiceDetails(prevDetails => ({
                ...prevDetails,
                gstAmount,
                totalAmount
            }));
        }
    }, [invoiceDetails.baseAmount]);

    const handleClientChange = (e) => {
        const { name, value } = e.target;
        setClientDetails(prevState => ({ ...prevState, [name]: value }));
    };

    const handleInvoiceChange = (e) => {
        const { name, value } = e.target;
        setInvoiceDetails(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            invoiceNo: invoiceDetails.invoiceNo,   // String
            name: clientDetails.name,              // String
            address: clientDetails.address,        // String
            phone: clientDetails.phone,            // String
            date: invoiceDetails.date,             // String (default to current date)
            description: invoiceDetails.description, // String
            totalAmount: parseFloat(invoiceDetails.totalAmount), // Number (convert to float)
            gstAmount: parseFloat(invoiceDetails.gstAmount),     // Number (convert to float)
            baseAmount: parseFloat(invoiceDetails.baseAmount),   // Number (convert to float)
            gstNo: clientDetails.gstNo,            // String
            email: clientDetails.email             // String
        };
        const clientData = {
            name: clientDetails.name,              // String
            address: clientDetails.address,        // String
            phone: clientDetails.phone,
            gstNo: clientDetails.gstNo,            // String
            email: clientDetails.email
        };
        try {
            console.log(clientData, formData)
            const response2 = await axios.post("http://localhost:3000/client/add", clientData);
            if (response2.data.success) {
                console.log("Client added");

            } else {
                console.log("Failed to add client:", response2.data.message);
            }
            const response1 = await axios.post("http://localhost:3000/invoice/add", formData);
            if (response1.data.success) {
                console.log("Invoice added");
                console.log(formData)
                setInvoice(formData);
                navigate('/check');
            } else {
                console.log("Failed to add invoice:", response1.data.message);
            }



        } catch (error) {
            console.error("Error occurred while submitting:", error);
        }
    };


    return (
        <>
            <Navbar />
            <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-10">
                <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Invoice Form</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Client Details Section */}
                        <div className="border p-4 rounded-lg bg-blue-50">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Client Details</h2>
                            <div className="space-y-4">
                                {/* Autocomplete with suggestions */}
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
                                    list="clientAddresses"
                                    placeholder="Address"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <datalist id="clientAddresses">
                                    {clientAddresses.map((address, index) => (
                                        <option key={index} value={address} />
                                    ))}
                                </datalist>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={clientDetails.phone}
                                    onChange={handleClientChange}
                                    list="clientPhones"
                                    placeholder="Phone"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <datalist id="clientPhones">
                                    {clientPhones.map((phone, index) => (
                                        <option key={index} value={phone} />
                                    ))}
                                </datalist>

                                <input
                                    type="email"
                                    name="email"
                                    value={clientDetails.email}
                                    onChange={handleClientChange}
                                    list="clientEmails"
                                    placeholder="Email"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <datalist id="clientEmails">
                                    {clientEmails.map((email, index) => (
                                        <option key={index} value={email} />
                                    ))}
                                </datalist>

                                <input
                                    type="text"
                                    name="gstNo"
                                    value={clientDetails.gstNo}
                                    onChange={handleClientChange}
                                    list="clientGstNos"
                                    placeholder="GST No"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <datalist id="clientGstNos">
                                    {clientGstNos.map((gstNo, index) => (
                                        <option key={index} value={gstNo} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        {/* Invoice Details Section */}
                        <div className="border p-4 rounded-lg bg-green-50">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Invoice Details</h2>
                            <div className="space-y-4">
                                <input
                                    type="number"
                                    name="baseAmount"
                                    value={invoiceDetails.baseAmount}
                                    onChange={handleInvoiceChange}
                                    placeholder="Base Amount"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="text"
                                    name="invoiceNo"
                                    value={invoiceDetails.invoiceNo}
                                    onChange={handleInvoiceChange}
                                    placeholder="Invoice No"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="date"
                                    name="date"
                                    value={invoiceDetails.date}
                                    readOnly // Prevent changes
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
                                />
                                <textarea
                                    name="description"
                                    value={invoiceDetails.description}
                                    onChange={handleInvoiceChange}
                                    placeholder="Description"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                />
                                {/* GST and Total Amount (Read-only) */}
                                <input
                                    type="text"
                                    name="gstAmount"
                                    value={invoiceDetails.gstAmount}
                                    readOnly
                                    placeholder="GST Amount (18%)"
                                    className="w-full p-4 border border-gray-300 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    name="totalAmount"
                                    value={invoiceDetails.totalAmount}
                                    readOnly
                                    placeholder="Total Amount"
                                    className="w-full p-4 border border-gray-300 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            Submit Invoice
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default InvoiceForm;
