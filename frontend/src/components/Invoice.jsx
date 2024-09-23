


const Invoice = ({ invoice }) => {
    return (
        <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-md mb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Invoice: {invoice.invoiceNo}</h3>
            <div className="grid grid-cols-2 gap-4">
                <p><strong>Name:</strong> {invoice.name}</p>
                <p><strong>Date:</strong> {invoice.date}</p>
                <p><strong>Address:</strong> {invoice.address}</p>
                <p><strong>Phone:</strong> {invoice.phone}</p>
                <p><strong>GST No:</strong> {invoice.gstNo}</p>
                <p><strong>Email:</strong> {invoice.email || "N/A"}</p>
                <p><strong>Description:</strong> {invoice.description}</p>
                <p><strong>Base Amount:</strong> ${invoice.baseAmount}</p>
                <p><strong>GST Amount:</strong> ${invoice.gstAmount}</p>
                <p><strong>Total Amount:</strong> ${invoice.totalAmount}</p>
            </div>
        </div>
    );
};

export default Invoice;
