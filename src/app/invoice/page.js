"use client";

import { useState, useRef } from "react";
import { FiDownload, FiPrinter, FiMail, FiCalendar, FiDollarSign, FiFileText, FiUser } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const invoiceData = {
  companyName: "ClientPortal UOL",
  companyAddress: "123 Business Street, Suite 100",
  companyCity: "New York, NY 10001",
  companyPhone: "+1 (555) 123-4567",
  companyEmail: "billing@clientportal-uol.com",
  clientName: "Acme Corporation",
  clientContact: "John Smith",
  clientEmail: "john.smith@acme.com",
  clientAddress: "456 Client Avenue",
  clientCity: "San Francisco, CA 94102",
  clientNumber: "CL-00123",
  invoiceNumber: "INV-2025-0456",
  invoiceDate: "2025-07-01",
  dueDate: "2025-07-15",
  status: "Paid",
  currency: "USD",
  items: [
    { 
      description: "CV Sourcing Service - Premium Package", 
      quantity: 3, 
      rate: 500.00, 
      amount: 1500.00,
      period: "June 2025"
    },
    { 
      description: "Prequalification Assessment Services", 
      quantity: 2, 
      rate: 400.00, 
      amount: 800.00,
      period: "June 2025"
    },
    { 
      description: "360/Direct Placement Fee", 
      quantity: 1, 
      rate: 1200.00, 
      amount: 1200.00,
      period: "June 2025"
    },
  ],
  subtotal: 3500.00,
  tax: 280.00,
  taxRate: 8,
  notes: "Thank you for choosing ClientPortal UOL. Payment terms: Net 15 days.",
  paymentMethod: "Bank Transfer",
};

export default function ClientInvoicePage() {
  const invoiceRef = useRef();
  
  const calculateTotal = () => {
    return invoiceData.subtotal + invoiceData.tax;
  };

  const printInvoice = () => {
    window.print();
  };

  const downloadInvoicePDF = async () => {
    try {
      const element = invoiceRef.current;
      
      if (!element) {
        alert('Invoice element not found. Please try again.');
        return;
      }

      // Hide action buttons temporarily for cleaner PDF
      const actionButtons = element.querySelector('.flex.flex-wrap.gap-3.pt-6.border-t');
      if (actionButtons) {
        actionButtons.style.display = 'none';
      }

      // Wait a moment for any dynamic content to load and ensure proper rendering
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get the actual dimensions including any overflow
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);
      const paddingTop = parseInt(computedStyle.paddingTop);
      const paddingBottom = parseInt(computedStyle.paddingBottom);
      
      // Create canvas from the invoice element with improved settings
      const canvas = await html2canvas(element, {
        scale: 1.5, // Higher scale for better quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth, // Use scrollWidth to capture full content
        height: element.scrollHeight + paddingTop + paddingBottom + 50, // Add extra padding for text
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (node) => {
          // Skip elements that might have problematic styles
          return node.tagName === 'STYLE' || node.tagName === 'SCRIPT';
        },
        onclone: (clonedDoc) => {
          // Force standard colors and ensure proper text rendering
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              color: rgb(0, 0, 0) !important;
              background-color: rgb(255, 255, 255) !important;
              border-color: rgb(200, 200, 200) !important;
              line-height: 1.6 !important;
              box-sizing: border-box !important;
            }
            .bg-green-100 { background-color: rgb(220, 252, 231) !important; }
            .text-green-800 { color: rgb(22, 101, 52) !important; }
            .bg-yellow-100 { background-color: rgb(254, 249, 195) !important; }
            .text-yellow-800 { color: rgb(133, 77, 14) !important; }
            .bg-red-100 { background-color: rgb(254, 226, 226) !important; }
            .text-red-800 { color: rgb(153, 27, 27) !important; }
            .text-gray-900 { color: rgb(17, 24, 39) !important; }
            .text-gray-600 { color: rgb(75, 85, 99) !important; }
            .bg-gray-50 { background-color: rgb(249, 250, 251) !important; }
            .border-b { border-bottom: 1px solid rgb(229, 231, 235) !important; }
            .border-t { border-top: 1px solid rgb(229, 231, 235) !important; }
            table { border-collapse: collapse !important; }
            td, th { 
              padding: 12px !important; 
              border-bottom: 1px solid rgb(229, 231, 235) !important;
              vertical-align: top !important;
            }
            p, div, span { 
              margin-bottom: 4px !important;
              overflow: visible !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });
      
      // Show action buttons again
      if (actionButtons) {
        actionButtons.style.display = 'flex';
      }
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create PDF with better sizing to prevent text cutoff
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions with proper margins
      const margin = 15; // Larger margins
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - (margin * 2);
      
      const imgWidth = availableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If content is too tall for one page, create multiple pages
      if (imgHeight > availableHeight) {
        let yPosition = 0;
        let pageCount = 0;
        
        while (yPosition < imgHeight) {
          if (pageCount > 0) {
            pdf.addPage();
          }
          
          const remainingHeight = imgHeight - yPosition;
          const pageHeight = Math.min(availableHeight, remainingHeight);
          
          // Calculate the source Y position for this page
          const sourceY = (yPosition / imgHeight) * canvas.height;
          const sourceHeight = (pageHeight / imgHeight) * canvas.height;
          
          // Create a temporary canvas for this page section
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceHeight;
          const pageCtx = pageCanvas.getContext('2d');
          
          pageCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
          const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
          
          pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, pageHeight);
          
          yPosition += availableHeight * 0.9; // Slight overlap to prevent text cutoff
          pageCount++;
        }
      } else {
        // Single page - center vertically if there's extra space
        const yOffset = margin + Math.max(0, (availableHeight - imgHeight) / 2);
        pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight);
      }
      
      // Download the PDF
      const filename = `${invoiceData.invoiceNumber || 'invoice'}.pdf`;
      pdf.save(filename);
      
    } catch (error) {
      console.error('Detailed PDF error:', error);
      
      // Fallback to simple PDF if canvas fails
      if (error.message && (error.message.includes('oklch') || error.message.includes('color'))) {
        alert('Generating simplified PDF due to styling compatibility...');
        generateSimplePDF();
      } else {
        let errorMessage = 'Error generating PDF. ';
        if (error.message) {
          errorMessage += `Details: ${error.message}`;
        } else {
          errorMessage += 'Please check console for details and try again.';
        }
        alert(errorMessage);
      }
    }
  };

  // Fallback simple PDF generator
  const generateSimplePDF = () => {
    const pdf = new jsPDF();
    
    // Add content to PDF
    pdf.setFontSize(20);
    pdf.text('INVOICE', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 20, 50);
    pdf.text(`Company: ${invoiceData.companyName}`, 20, 60);
    pdf.text(`Client: ${invoiceData.clientName}`, 20, 70);
    pdf.text(`Date: ${invoiceData.invoiceDate}`, 20, 80);
    pdf.text(`Due Date: ${invoiceData.dueDate}`, 20, 90);
    pdf.text(`Status: ${invoiceData.status}`, 20, 100);
    
    // Add items
    let yPos = 120;
    pdf.text('Services:', 20, yPos);
    yPos += 10;
    
    invoiceData.items.forEach((item, index) => {
      pdf.text(`${index + 1}. ${item.description}`, 20, yPos);
      pdf.text(`Qty: ${item.quantity} × $${item.rate.toFixed(2)} = $${item.amount.toFixed(2)}`, 30, yPos + 8);
      yPos += 20;
    });
    
    // Add totals
    yPos += 10;
    pdf.text(`Subtotal: $${invoiceData.subtotal.toFixed(2)}`, 20, yPos);
    pdf.text(`Tax: $${invoiceData.tax.toFixed(2)}`, 20, yPos + 10);
    pdf.text(`Total: $${calculateTotal().toFixed(2)} ${invoiceData.currency}`, 20, yPos + 20);
    
    // Add notes
    if (invoiceData.notes) {
      pdf.text('Notes:', 20, yPos + 40);
      const splitNotes = pdf.splitTextToSize(invoiceData.notes, 170);
      pdf.text(splitNotes, 20, yPos + 50);
    }
    
    pdf.save(`${invoiceData.invoiceNumber}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Invoice</h1>

        <Card className="p-8" ref={invoiceRef}>
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{invoiceData.companyName}</h2>
              <p className="text-gray-600">{invoiceData.companyEmail}</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
              <p className="text-gray-600">{invoiceData.invoiceNumber}</p>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                invoiceData.status === 'Paid' ? 'bg-green-100 text-green-800' :
                invoiceData.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {invoiceData.status}
              </div>
            </div>
          </div>

          {/* Client & Date Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
              <div className="text-gray-600">
                <p className="font-medium text-gray-900">{invoiceData.clientName}</p>
                <p>{invoiceData.clientEmail}</p>
                <p>Client ID: {invoiceData.clientNumber}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="space-y-1">
                <p><span className="text-gray-600">Date:</span> {invoiceData.invoiceDate}</p>
                <p><span className="text-gray-600">Due:</span> {invoiceData.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-semibold text-gray-900">Service</th>
                  <th className="text-center py-3 font-semibold text-gray-900">Qty</th>
                  <th className="text-right py-3 font-semibold text-gray-900">Rate</th>
                  <th className="text-right py-3 font-semibold text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-3 text-gray-900">{item.description}</td>
                    <td className="py-3 text-center text-gray-900">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-900">${item.rate.toFixed(2)}</td>
                    <td className="py-3 text-right font-semibold text-gray-900">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${invoiceData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({invoiceData.taxRate}%):</span>
                  <span>${invoiceData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)} {invoiceData.currency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-6 border-t">
            <Button 
              onClick={printInvoice}
              className="flex items-center bg-blue-600 hover:bg-blue-700"
            >
              <FiPrinter className="mr-2" />
              Print
            </Button>
            <Button 
              onClick={downloadInvoicePDF}
              className="flex items-center bg-green-600 hover:bg-green-700"
            >
              <FiDownload className="mr-2" />
              Download PDF
            </Button>
          </div>

          {/* Notes */}
          {invoiceData.notes && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">{invoiceData.notes}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
