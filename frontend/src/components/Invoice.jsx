import React from 'react';
import { useSetRecoilState } from "recoil"
import { viewAtom } from "../store/atom"
import { useNavigate } from "react-router-dom"
const Invoice = ({ invoice }) => {
    const navigate = useNavigate();
    const setInvoice = useSetRecoilState(viewAtom);
    const handleEdit = () => {
        setInvoice(invoice);
        console.log(invoice);
        navigate("/updateForm")
    }


    return (
        <div className="relative p-6 bg-white border border-gray-300 rounded-lg shadow-lg w-4/5 mx-auto mb-6">
            {/* Edit Button */}
            <button className="absolute top-4 right-4 bg-[#E85523] text-white px-7 py-2 rounded-full hover:bg-orange-600 transition duration-300 hover:scale-110"
                onClick={handleEdit}
            >
                Edit
            </button>

            {/* Invoice Title */}
            <h3 className="text-3xl font-bold text-[#E85523] mb-4">Invoice: {invoice.invoiceNo}</h3>
            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-4 text-lg font-medium">
                <p><strong className="text-xl text-gray-800">Name:</strong> <span className="text-2xl text-gray-600">{invoice.name}</span></p>
                <p><strong className="text-xl text-gray-800">Date:</strong> <span className="text-2xl text-gray-600">{invoice.date}</span></p>
                <p><strong className="text-xl text-gray-800">Address:</strong> <span className="text-2xl text-gray-600">{invoice.address}</span></p>
                <p><strong className="text-xl text-gray-800">GST No:</strong> <span className="text-2xl text-gray-600">{invoice.gstNo}</span></p>
                <p><strong className="text-xl text-gray-800">Email:</strong> <span className="text-2xl text-gray-600">{invoice.email || "N/A"}</span></p>
                <p><strong className="text-xl text-gray-800">Description:</strong> <span className="text-2xl text-gray-600">{invoice.description}</span></p>
                <p><strong className="text-xl text-gray-800">Base Amount:</strong> <span className="text-2xl text-gray-600">{invoice.baseAmount}</span></p>
                <p><strong className="text-xl text-gray-800">GST Amount:</strong> <span className="text-2xl text-gray-600">{invoice.gstAmount}</span></p>
                <p><strong className="text-xl text-gray-800">Total Amount:</strong> <span className="text-2xl text-gray-600">{invoice.totalAmount}</span></p>
            </div>
        </div>
    );
};

export default Invoice;