"use client";

import { useRef } from "react";
import { FiDownload } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";

const invoiceData = {
  clientName: "Acme Corp.",
  clientNumber: "CL-00123",
  invoiceNumber: "INV-2025-0456",
  invoiceDate: "2025-07-01",
  dueDate: "2025-07-15",
  status: "Paid",
  currency: "USD",
  items: [
    { description: "Consulting Service", roles: 3, amount: 1500 },
    { description: "Implementation Fee", roles: 1, amount: 800 },
  ],
  notes: "Thank you for your business!",
};

export default function ClientInvoicePage() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  const total = invoiceData.items.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div ref={componentRef} className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-10">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Invoice</h1>
            <p className="text-gray-600">{invoiceData.invoiceNumber}</p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <FiDownload className="mr-2" /> Download PDF
          </button>
        </header>

        <section className="grid grid-cols-2 gap-4 mb-8 text-gray-700">
          <div>
            <h2 className="font-semibold">Bill To:</h2>
            <p>{invoiceData.clientName}</p>
            <p>Client # {invoiceData.clientNumber}</p>
          </div>
          <div className="text-right">
            <p><span className="font-semibold">Invoice Date:</span> {invoiceData.invoiceDate}</p>
            <p><span className="font-semibold">Due Date:</span> {invoiceData.dueDate}</p>
            <p><span className="font-semibold">Status:</span> {invoiceData.status}</p>
            <p><span className="font-semibold">Currency:</span> {invoiceData.currency}</p>
          </div>
        </section>

        <table className="text-black w-full mb-8 text-left border-collapse">
          <thead>
            <tr className="bg-gray-0">
              <th className="p-3">Description</th>
              <th className="p-3">Num of Roles</th>
              <th className="p-3">Amount ({invoiceData.currency})</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-3 text-gray-0">{item.description}</td>
                <td className="p-3">{item.roles}</td>
                <td className="p-3 font-semibold">{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="p-3 text-right font-bold">Total:</td>
              <td className="p-3 font-bold">{total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        {invoiceData.notes && (
          <p className="text-gray-600 italic">Note: {invoiceData.notes}</p>
        )}
      </div>
    </div>
  );
}
