import React, { useRef } from 'react';
import Logo from '../assets/Logo.png';
import { useRecoilValue } from "recoil";
import { invoiceAtom } from '../store/atom';
import { useNavigate } from "react-router-dom";
import { usePDF } from 'react-to-pdf';
import ReactToPdf from 'react-to-pdf';  // Correct import

const InvoicePage = () => {
    const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
    const invoice = useRecoilValue(invoiceAtom);
    const navigate = useNavigate();
    const ref = useRef();  // Reference to the PDF container

    if (!localStorage.getItem("token")) {
        navigate("/");
    }

    return (
        <>
            <div className="flex justify-center items-center my-4">
                <button
                    className="bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-orange-500 hover:to-orange-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300"
                    onClick={() => toPDF()}
                >
                    Download PDF
                </button>
            </div>

            <div ref={targetRef} className="relative bg-gray-100 p-10 font-sans">
                {/* Main Invoice Content */}
                <div ref={ref} className="relative z-10 max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-md border border-gray-300">
                    {/* Your existing invoice content */}
                    {/* Watermark */}
                    <div className="absolute inset-0 flex justify-center items-center opacity-[.1] pointer-events-none z-20">
                        <img
                            src={Logo}
                            alt="Phoenix Watermark"
                            className="w-[80%] h-1/3 object-contain"
                        />
                    </div>

                    {/* Invoice header */}
                    <div className="flex justify-between items-center pb-6">
                        <div className="bg-[#E85523] px-8 py-2 inline-block pb-8">
                            <h1 className="text-5xl font-bold text-white">Invoice</h1>
                        </div>
                        <div>
                            <img src={Logo} alt="Phoenix Technosoft Logo" className="h-24" />
                        </div>
                    </div>

                    {/* Billed To and Billing Details */}
                    <div className="flex justify-between space-x-12 mt-6">
                        {/* Billed To Section */}
                        <div className="w-1/2">
                            <h2 className="text-xl font-bold text-[#E85523] mb-2">BILLED TO</h2>
                            <p className="text-lg font-semibold text-orange-600">{invoice.name}</p>
                            <p className="text-gray-600">{invoice.address}</p>
                            <p className="text-gray-600">{invoice.city}, {invoice.state}, {invoice.zipCode}</p>
                            <p className="text-lg font-bold text-[#E85523]">{invoice.gstIn}</p>
                        </div>

                        {/* Billing Details Section */}
                        <div className="w-1/2">
                            <h2 className="text-xl font-bold text-[#E85523] mb-2">BILLING DETAILS</h2>
                            <p className="text-lg font-semibold text-orange-600">PHOENIX TECHNOSOFT</p>
                            <p className="text-gray-600">ACCOUNT NUMBER - 924020034149080</p>
                            <p className="text-gray-600">IFSC - UTIB0002498</p>
                            <p className="text-gray-600">UPI - PHOENIXTECH@AXISBANK</p>
                            <p className="text-gray-600">Shop No-65, New Defence Colony, Muradnagar, Ghaziabad, Uttar Pradesh, 201206</p>
                            <p className="text-gray-600">GST - 09ASPPT1664A1ZI | SAC Code- 9983</p>
                        </div>
                    </div>

                    {/* GST and Invoice Details */}
                    <div className="mt-6">
                        <p className="text-lg font-bold text-[#E85523]">DATE: {invoice.date}</p>
                        <p className="text-2xl text-gray-600">INVOICE#  {invoice.invoiceNo}</p>
                    </div>

                    {/* Invoice Description Table */}
                    <div className="mt-6">
                        <div className="border-t-4 border-[#E85523]">
                            <table className="w-full mt-4 text-left">
                                <thead>
                                    <tr>
                                        <th className="text-xl py-2 text-[#E85523]">DESCRIPTION</th>
                                        <th className="py-2 text-right text-gray-600">AMOUNT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-lg py-4 text-gray-800">{invoice.description}</td>
                                        <td className="text-xl py-4 text-right text-gray-800">{invoice.baseAmount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Amount Details */}
                    <div className="flex justify-end mt-4 border-t-2 border-gray-200 pt-4">
                        <div className="w-1/3">
                            <div className="flex justify-between mb-2">
                                <p className="text-gray-700">TOTAL</p>
                                <p className="text-xl text-gray-700">{invoice.baseAmount}</p>
                            </div>
                            <div className="flex justify-between mb-2">
                                <p className="text-gray-700">GST(18%)</p>
                                <p className="text-xl text-gray-700">{invoice.gstAmount}</p>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t-2 border-[#E85523] pt-4">
                                <p className="text-black">AMOUNT</p>
                                <p className=" text-2xl text-black">{invoice.totalAmount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-6">
                        <p className="text-lg font-semibold text-gray-700 mb-2">Have Questions?</p>
                        <p className="text-gray-600">Call us: 8587 888 326</p>
                        <p className="text-gray-600">Mail us: phoenixtechnosoftindia@gmail.com</p>

                        <p className="italic text-sm text-gray-500 mt-6">
                            This package doesn’t come with a performance guarantee. We reserve the right to change our terms & conditions without notice. No refunds will be entertained.
                        </p>
                        <p className="mt-4 text-blue-700">www.phoenixtechnosoft.com</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InvoicePage;
