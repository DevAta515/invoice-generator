import React from 'react';
import { useSetRecoilState } from "recoil";
import { viewAtom, invoiceAtom } from "../store/atom";
import { useNavigate } from "react-router-dom";

const Invoice = ({ invoice }) => {
    const navigate = useNavigate();
    const setInvoice = useSetRecoilState(viewAtom);
    const printInvoice = useSetRecoilState(invoiceAtom)

    if (!localStorage.getItem("token")) {
        navigate("/");
    }

    const handleEdit = () => {
        setInvoice(invoice);
        console.log(invoice);
        navigate("/updateForm");
    };
    const handlePrint = () => {
        printInvoice(invoice);
        console.log(invoice);
        navigate("/check");
    };

    return (
        <div className="relative p-6 bg-white border border-gray-300 rounded-lg shadow-lg w-4/5 mx-auto mb-6">
            {/* Edit Button */}
            <button
                className="absolute top-4 right-32 bg-[#E85523] text-white px-7 py-2 rounded-full hover:bg-orange-600 transition duration-300 hover:scale-110"
                onClick={handleEdit}
            >
                Edit
            </button>
            <button
                className="absolute top-4 right-4 bg-[#E82245] text-white px-7 py-2 rounded-full hover:bg-red-900 transition duration-300 hover:scale-110"
                onClick={handlePrint}
            >
                Print
            </button>

            {/* Invoice Title */}
            <h3 className="text-3xl font-bold text-[#E85523] mb-4">Invoice: {invoice.invoiceNo}</h3>

            {/* Invoice Main Details */}
            <div className="grid grid-cols-2 gap-4 text-lg font-medium">
                <p><strong className="text-xl text-gray-800">Name:</strong> <span className="text-2xl text-gray-600">{invoice.name}</span></p>
                <p><strong className="text-xl text-gray-800">Date:</strong> <span className="text-2xl text-gray-600">{invoice.date}</span></p>
                <p><strong className="text-xl text-gray-800">Address:</strong> <span className="text-2xl text-gray-600">{invoice.address}</span></p>
                <p><strong className="text-xl text-gray-800">GST No:</strong> <span className="text-2xl text-gray-600">{invoice.gstNo}</span></p>
                <p><strong className="text-xl text-gray-800">Email:</strong> <span className="text-2xl text-gray-600">{invoice.email || "N/A"}</span></p>
            </div>

            {/* Invoice Items */}
            <h4 className="text-2xl font-bold text-[#E85523] mt-6 mb-2">Items</h4>
            <div className="grid grid-cols-1 gap-6">
                {invoice.items && invoice.items.length > 0 ? (
                    invoice.items.map((item, index) => (
                        <div key={index} className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                            {/* Grid layout for items */}
                            <div className="grid grid-cols-2 gap-4">
                                <p><strong className="text-xl text-gray-800">Description:</strong> <span className="text-2xl text-gray-600">{item.description}</span></p>
                                <p><strong className="text-xl text-gray-800">Base Amount:</strong> <span className="text-2xl text-gray-600">{item.baseAmount}</span></p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <p><strong className="text-xl text-gray-800">GST Amount:</strong> <span className="text-2xl text-gray-600">{item.gstAmount}</span></p>
                                <p><strong className="text-xl text-gray-800">Total Amount:</strong> <span className="text-2xl text-gray-600">{item.totalAmount}</span></p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-lg text-gray-600">No items available</p>
                )}
            </div>
        </div>
    );
};

export default Invoice;
