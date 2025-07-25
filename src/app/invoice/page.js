"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FiDownload, FiPrinter, FiMail, FiCalendar, FiDollarSign, FiFileText, FiUser, FiEye, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentSubscription } from "@/lib/subscription";
import { getUserInvoices, convertSubscriptionToInvoice } from "@/lib/invoice";

export default function ClientInvoicePage() {
  const { user, isAuthenticated } = useAuth();
  const invoiceRef = useRef();
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'detail'
  const [isLoading, setIsLoading] = useState(true);

  // Generate invoice number
  const generateInvoiceNumber = (index, date) => {
    const year = new Date(date).getFullYear();
    const month = String(new Date(date).getMonth() + 1).padStart(2, '0');
    return `INV-${year}-${month}-${String(index + 1).padStart(4, '0')}`;
  };

  // Fetch user invoices from backend or subscription history
  const fetchUserInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      if (!isAuthenticated || !user?.id) {
        console.log('Invoice - User not authenticated:', { isAuthenticated, user: user?.id });
        setInvoices([]);
        setIsLoading(false);
        return;
      }
      
      const userId = parseInt(user.id);
      console.log('Invoice - Fetching invoices for user:', userId);
      
      // First try to get invoices from the dedicated backend API
      let userInvoices = await getUserInvoices(userId);
      console.log('Invoice - Backend API response:', userInvoices);
      
      // If no invoices found in backend, try to get from subscription history
      if (!userInvoices || userInvoices.length === 0) {
        console.log('No invoices found in backend, checking subscription history...');
        const subscriptionData = await getCurrentSubscription(userId);
        console.log('Invoice - Subscription data:', subscriptionData);
        
        if (subscriptionData && subscriptionData.credits && subscriptionData.credits.history) {
          // Convert subscriptions to invoice format
          userInvoices = subscriptionData.credits.history.map((subscription, index) => {
            return convertSubscriptionToInvoice(subscription, index);
          });
          
          console.log('Converted subscription history to invoices:', userInvoices);
        } else {
          userInvoices = [];
          console.log('No subscription history found');
        }
      } else {
        console.log('Found invoices in backend:', userInvoices);
        
        // Convert backend invoice format to frontend format
        userInvoices = userInvoices.map((invoice, index) => {
          return {
            id: invoice.id,
            companyName: invoice.companyInfo?.name || "ClientPortal UOL",
            companyAddress: invoice.companyInfo?.address || "123 Business Street, Suite 100",
            companyCity: invoice.companyInfo?.city || "New York, NY 10001",
            companyPhone: invoice.companyInfo?.phone || "+1 (555) 123-4567",
            companyEmail: invoice.companyInfo?.email || "billing@clientportal-uol.com",
            clientName: invoice.billingAddress?.name || "Client User",
            clientContact: invoice.billingAddress?.name || "Client User",
            clientEmail: invoice.billingAddress?.email || "user@example.com",
            clientAddress: invoice.billingAddress?.address || "456 Client Avenue",
            clientCity: invoice.billingAddress?.city || "San Francisco, CA 94102",
            clientNumber: invoice.billingAddress?.clientNumber || `CL-${String(userId).padStart(5, '0')}`,
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: new Date(invoice.invoiceDate).toISOString().split('T')[0],
            dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
            status: invoice.status === 'paid' ? 'Paid' : invoice.status === 'pending' ? 'Pending' : 'Overdue',
            currency: invoice.currency || "USD",
            items: invoice.items || [],
            subtotal: invoice.subtotal || 0,
            tax: invoice.taxAmount || 0,
            taxRate: invoice.taxRate || 0,
            total: invoice.total || 0,
            notes: invoice.notes || "Thank you for choosing ClientPortal UOL.",
            paymentMethod: invoice.paymentMethod || "Credit Card",
            service: invoice.userSubscription?.subscription?.title || 'Unknown Service',
            purchaseDate: invoice.createdAt || invoice.invoiceDate,
            backendData: invoice
          };
        });
      }

      // Sort invoices by date (newest first)
      userInvoices.sort((a, b) => {
        const dateA = new Date(a.purchaseDate || a.invoiceDate);
        const dateB = new Date(b.purchaseDate || b.invoiceDate);
        return dateB - dateA;
      });
      
      setInvoices(userInvoices);
      
      // Auto-select the most recent invoice if available
      if (userInvoices.length > 0) {
        setSelectedInvoice(userInvoices[0]);
      }
      
      console.log('Final processed invoices:', userInvoices);
    } catch (error) {
      console.error('Error fetching user invoices:', error);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]); // Add useCallback dependencies

  // Load invoices on component mount
  useEffect(() => {
    fetchUserInvoices();
    
    // Listen for subscription updates to refresh invoices
    const handleSubscriptionUpdate = () => {
      console.log('Invoices - Subscription update detected, refreshing invoices');
      setTimeout(() => fetchUserInvoices(), 500);
    };

    // Listen for payment completion to refresh invoices
    const handlePaymentComplete = () => {
      console.log('Invoices - Payment completed, refreshing invoices');
      setTimeout(() => fetchUserInvoices(), 1000); // Delay to ensure backend is updated
    };

    // Listen for invoice-specific events
    const handleInvoiceGenerated = (event) => {
      console.log('Invoices - New invoice generated:', event.detail);
      setTimeout(() => fetchUserInvoices(), 2000); // Longer delay for invoice generation
    };

    const handleInvoiceUpdated = (event) => {
      console.log('Invoices - Invoice updated:', event.detail);
      setTimeout(() => fetchUserInvoices(), 1000);
    };

    // Add all event listeners
    window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    window.addEventListener('paymentCompleted', handlePaymentComplete);
    window.addEventListener('invoiceGenerated', handleInvoiceGenerated);
    window.addEventListener('invoiceCreated', handleInvoiceGenerated);
    window.addEventListener('invoiceUpdated', handleInvoiceUpdated);
    
    return () => {
      window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate);
      window.removeEventListener('paymentCompleted', handlePaymentComplete);
      window.removeEventListener('invoiceGenerated', handleInvoiceGenerated);
      window.removeEventListener('invoiceCreated', handleInvoiceGenerated);
      window.removeEventListener('invoiceUpdated', handleInvoiceUpdated);
    };
  }, [user, isAuthenticated, fetchUserInvoices]); // Add fetchUserInvoices dependency

  // Function to generate invoice for a subscription purchase (can be called from payment flow)
  const generateInvoiceForSubscription = async (subscriptionDetails) => {
    try {
      console.log('Generating invoice for subscription:', subscriptionDetails);
      
      // This function can be used by the payment system to generate invoices
      // when a subscription is purchased
      
      // For now, we'll just refresh the invoices to pick up the new subscription
      setTimeout(() => fetchUserInvoices(), 500);
      
    } catch (error) {
      console.error('Error generating invoice for subscription:', error);
    }
  };

  // Expose the function globally so payment components can call it
  useEffect(() => {
    window.generateInvoiceForSubscription = generateInvoiceForSubscription;
    
    return () => {
      delete window.generateInvoiceForSubscription;
    };
  }, []);

  // Direct PDF generation that doesn't rely on selectedInvoice state
  const generateDirectPDF = (invoice) => {
    if (!invoice) {
      alert('No invoice data provided for PDF generation.');
      return;
    }

    console.log('Generating direct PDF for invoice:', invoice.invoiceNumber);
    
    try {
      const pdf = new jsPDF();
      
      // Add content to PDF
      pdf.setFontSize(20);
      pdf.text('INVOICE', 20, 30);
      
      pdf.setFontSize(12);
      pdf.text(`Invoice Number: ${invoice.invoiceNumber || 'N/A'}`, 20, 50);
      pdf.text(`Company: ${invoice.companyName || 'ClientPortal UOL'}`, 20, 60);
      pdf.text(`Client: ${invoice.clientName || 'Client User'}`, 20, 70);
      pdf.text(`Date: ${invoice.invoiceDate || 'N/A'}`, 20, 80);
      pdf.text(`Due Date: ${invoice.dueDate || 'N/A'}`, 20, 90);
      pdf.text(`Status: ${invoice.status || 'N/A'}`, 20, 100);
      
      // Add items
      let yPos = 120;
      pdf.text('Services:', 20, yPos);
      yPos += 10;
      
      if (invoice.items && invoice.items.length > 0) {
        invoice.items.forEach((item, index) => {
          const description = item.description || 'Service';
          const quantity = item.quantity || 0;
          const rate = item.rate || 0;
          const amount = item.amount || 0;
          
          pdf.text(`${index + 1}. ${description}`, 20, yPos);
          pdf.text(`Qty: ${quantity} × $${rate.toFixed(2)} = $${amount.toFixed(2)}`, 30, yPos + 8);
          yPos += 20;
        });
      } else {
        pdf.text('No service items found', 20, yPos);
        yPos += 20;
      }
      
      // Add totals
      yPos += 10;
      const subtotal = invoice.subtotal || 0;
      const tax = invoice.tax || invoice.taxAmount || 0;
      const total = calculateTotal(invoice);
      
      pdf.text(`Subtotal: $${subtotal.toFixed(2)}`, 20, yPos);
      pdf.text(`Tax: $${tax.toFixed(2)}`, 20, yPos + 10);
      pdf.text(`Total: $${total.toFixed(2)} ${invoice.currency || 'USD'}`, 20, yPos + 20);
      
      // Add notes
      if (invoice.notes) {
        const notesLines = pdf.splitTextToSize(invoice.notes, 170);
        pdf.text('Notes:', 20, yPos + 40);
        pdf.text(notesLines, 20, yPos + 50);
      }
      
      const filename = `${invoice.invoiceNumber || 'invoice'}.pdf`;
      pdf.save(filename);
      
      console.log('Direct PDF generated successfully:', filename);
    } catch (error) {
      console.error('Error generating direct PDF:', error);
      alert('Unable to generate PDF. Error: ' + error.message);
    }
  };

  const calculateTotal = (invoice) => {
    if (!invoice) return 0;
    // Use the total from invoice if available, otherwise calculate
    if (invoice.total !== undefined && invoice.total !== null) {
      return invoice.total;
    }
    // Fallback calculation
    const subtotal = invoice.subtotal || 0;
    const tax = invoice.tax || invoice.taxAmount || 0;
    return subtotal + tax;
  };

  const printInvoice = () => {
    window.print();
  };

  const downloadInvoicePDF = async () => {
    if (!selectedInvoice) {
      alert('Please select an invoice to download.');
      return;
    }

    console.log('Starting PDF download for invoice:', selectedInvoice);

    try {
      const element = invoiceRef.current;
      
      if (!element) {
        alert('Invoice element not found. Please try again.');
        return;
      }

      console.log('Element found, starting PDF generation...');

      // Hide action buttons temporarily for cleaner PDF
      const actionButtons = element.querySelector('.flex.justify-end.pt-6');
      if (actionButtons) {
        actionButtons.style.display = 'none';
      }

      // Wait a moment for any dynamic content to load
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Creating canvas from element...');
      
      // Create canvas from the invoice element with improved settings
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        onclone: (clonedDoc) => {
          // Force standard colors and ensure proper text rendering
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              color: #000000 !important;
              background-color: #ffffff !important;
              border-color: #cccccc !important;
              line-height: 1.6 !important;
              box-sizing: border-box !important;
            }
            .bg-green-100 { background-color: #dcfce7 !important; }
            .text-green-800 { color: #166534 !important; }
            .bg-yellow-100 { background-color: #fef3c7 !important; }
            .text-yellow-800 { color: #92400e !important; }
            .bg-red-100 { background-color: #fee2e2 !important; }
            .text-red-800 { color: #991b1b !important; }
            .text-gray-900 { color: #111827 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .bg-gray-50 { background-color: #f9fafb !important; }
            .border-b { border-bottom: 1px solid #e5e7eb !important; }
            .border-t { border-top: 1px solid #e5e7eb !important; }
            table { border-collapse: collapse !important; }
            td, th { 
              padding: 12px !important; 
              border-bottom: 1px solid #e5e7eb !important;
              vertical-align: top !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });
      
      console.log('Canvas created, generating PDF...');
      
      // Show action buttons again
      if (actionButtons) {
        actionButtons.style.display = 'flex';
      }
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Create PDF with A4 dimensions
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions with margins
      const margin = 10;
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - (margin * 2);
      
      const imgWidth = availableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Check if content fits on one page
      if (imgHeight <= availableHeight) {
        // Single page - center content
        const yOffset = margin + Math.max(0, (availableHeight - imgHeight) / 2);
        pdf.addImage(imgData, 'JPEG', margin, yOffset, imgWidth, imgHeight);
      } else {
        // Multiple pages needed
        let yPosition = 0;
        let pageCount = 0;
        
        while (yPosition < imgHeight) {
          if (pageCount > 0) {
            pdf.addPage();
          }
          
          const remainingHeight = imgHeight - yPosition;
          const pageHeight = Math.min(availableHeight, remainingHeight);
          
          // Calculate which part of the image to use for this page
          const sourceY = (yPosition / imgHeight) * canvas.height;
          const sourceHeight = (pageHeight / imgHeight) * canvas.height;
          
          // Create a temporary canvas for this page section
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceHeight;
          const pageCtx = pageCanvas.getContext('2d');
          
          pageCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
          
          pdf.addImage(pageImgData, 'JPEG', margin, margin, imgWidth, pageHeight);
          
          yPosition += availableHeight * 0.95; // Small overlap to prevent content cutoff
          pageCount++;
        }
      }
      
      // Generate filename and download
      const filename = `${selectedInvoice.invoiceNumber || 'invoice'}.pdf`;
      console.log('Saving PDF as:', filename);
      pdf.save(filename);
      
      console.log('PDF download completed successfully');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Show action buttons again in case of error
      const actionButtons = invoiceRef.current?.querySelector('.flex.justify-end.pt-6');
      if (actionButtons) {
        actionButtons.style.display = 'flex';
      }
      
      // Try fallback simple PDF generation
      console.log('Attempting fallback PDF generation...');
      try {
        generateSimplePDF();
      } catch (fallbackError) {
        console.error('Fallback PDF generation failed:', fallbackError);
        alert('Error generating PDF. Please try again or contact support if the issue persists.');
      }
    }
  };

  // Fallback simple PDF generator
  const generateSimplePDF = () => {
    if (!selectedInvoice) return;
    
    console.log('Generating simple PDF for invoice:', selectedInvoice.invoiceNumber);
    
    try {
      const pdf = new jsPDF();
      
      // Add content to PDF
      pdf.setFontSize(20);
      pdf.text('INVOICE', 20, 30);
      
      pdf.setFontSize(12);
      pdf.text(`Invoice Number: ${selectedInvoice.invoiceNumber}`, 20, 50);
      pdf.text(`Company: ${selectedInvoice.companyName}`, 20, 60);
      pdf.text(`Client: ${selectedInvoice.clientName}`, 20, 70);
      pdf.text(`Date: ${selectedInvoice.invoiceDate}`, 20, 80);
      pdf.text(`Due Date: ${selectedInvoice.dueDate}`, 20, 90);
      pdf.text(`Status: ${selectedInvoice.status}`, 20, 100);
      
      // Add items
      let yPos = 120;
      pdf.text('Services:', 20, yPos);
      yPos += 10;
      
      if (selectedInvoice.items && selectedInvoice.items.length > 0) {
        selectedInvoice.items.forEach((item, index) => {
          const description = item.description || 'Service';
          const quantity = item.quantity || 0;
          const rate = item.rate || 0;
          const amount = item.amount || 0;
          
          pdf.text(`${index + 1}. ${description}`, 20, yPos);
          pdf.text(`Qty: ${quantity} × $${rate.toFixed(2)} = $${amount.toFixed(2)}`, 30, yPos + 8);
          yPos += 20;
        });
      }
      
      // Add totals
      yPos += 10;
      const subtotal = selectedInvoice.subtotal || 0;
      const tax = selectedInvoice.tax || selectedInvoice.taxAmount || 0;
      const total = calculateTotal(selectedInvoice);
      
      pdf.text(`Subtotal: $${subtotal.toFixed(2)}`, 20, yPos);
      pdf.text(`Tax: $${tax.toFixed(2)}`, 20, yPos + 10);
      pdf.text(`Total: $${total.toFixed(2)} ${selectedInvoice.currency || 'USD'}`, 20, yPos + 20);
      
      // Add notes
      if (selectedInvoice.notes) {
        const notesLines = pdf.splitTextToSize(selectedInvoice.notes, 170);
        pdf.text('Notes:', 20, yPos + 40);
        pdf.text(notesLines, 20, yPos + 50);
      }
      
      const filename = `${selectedInvoice.invoiceNumber || 'invoice'}.pdf`;
      pdf.save(filename);
      
      console.log('Simple PDF generated successfully:', filename);
    } catch (error) {
      console.error('Error generating simple PDF:', error);
      alert('Unable to generate PDF. Please try again.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {currentView === 'detail' && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('list')}
                  className="flex items-center gap-2"
                >
                  <FiChevronLeft />
                  Back to Invoices
                </Button>
              )}
              <h1 className="text-3xl font-bold text-gray-900">
                {currentView === 'list' ? 'Invoices' : 'Invoice Details'}
              </h1>
            </div>
            {currentView === 'list' && (
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('Manual refresh triggered');
                    fetchUserInvoices();
                  }}
                  className="flex items-center gap-2"
                >
                  <FiFileText />
                  Refresh
                </Button>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiFileText />
                  {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'}
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#0958d9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your invoices...</p>
              </div>
            </div>
          )}

          {/* Invoices List View */}
          {!isLoading && currentView === 'list' && (
            <div className="space-y-4">
              {invoices.length === 0 ? (
                <Card className="p-8 text-center">
                  <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Found</h3>
                  <p className="text-gray-600 mb-4">
                    You don&apos;t have any invoices yet. Invoices will appear here when you purchase subscriptions.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/subscription'}
                    className="bg-[#0958d9] hover:bg-[#24AC4A]"
                  >
                    Browse Subscriptions
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {invoices.map((invoice) => (
                    <Card key={invoice.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {invoice.invoiceNumber}
                            </h3>
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                              invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {invoice.status}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Service</p>
                              <p className="font-medium text-gray-900">{invoice.service}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Date</p>
                              <p className="font-medium text-gray-900">{invoice.invoiceDate}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Amount</p>
                              <p className="font-medium text-gray-900">
                                ${calculateTotal(invoice).toFixed(2)} {invoice.currency}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Credits</p>
                              <p className="font-medium text-gray-900">
                                {invoice.items[0]?.quantity || 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setCurrentView('detail');
                            }}
                            className="flex items-center gap-2"
                          >
                            <FiEye size={16} />
                            View
                          </Button>
                          
                          
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Invoice Detail View */}
          {!isLoading && currentView === 'detail' && selectedInvoice && (
            <Card className="p-8" ref={invoiceRef}>
              {/* Header */}
              <div className="flex justify-between items-start mb-8 pb-6 border-b">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedInvoice.companyName}</h2>
                  <p className="text-gray-600">{selectedInvoice.companyEmail}</p>
                </div>
                <div className="text-right">
                  <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
                  <p className="text-gray-600">{selectedInvoice.invoiceNumber}</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                    selectedInvoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    selectedInvoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedInvoice.status}
                  </div>
                </div>
              </div>

              {/* Client & Date Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                  <div className="text-gray-600">
                    <p className="font-medium text-gray-900">{selectedInvoice.clientName}</p>
                    <p>{selectedInvoice.clientEmail}</p>
                    <p>Client ID: {selectedInvoice.clientNumber}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="space-y-1">
                    <p><span className="text-gray-600">Date:</span> {selectedInvoice.invoiceDate}</p>
                    <p><span className="text-gray-600">Due:</span> {selectedInvoice.dueDate}</p>
                    <p><span className="text-gray-600">Service:</span> {selectedInvoice.service}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-semibold text-gray-900">Service</th>
                      <th className="text-center py-3 font-semibold text-gray-900">Credits</th>
                      <th className="text-right py-3 font-semibold text-gray-900">Rate</th>
                      <th className="text-right py-3 font-semibold text-gray-900">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-3 text-gray-900">
                          <div>
                            <p className="font-medium">{item.description}</p>
                            <p className="text-sm text-gray-600">{item.period}</p>
                          </div>
                        </td>
                        <td className="py-3 text-center text-gray-900">{item.quantity}</td>
                        <td className="py-3 text-right text-gray-900">
                          {item.rate === 0 ? 'Free' : `$${item.rate.toFixed(2)}`}
                        </td>
                        <td className="py-3 text-right font-semibold text-gray-900">
                          {item.amount === 0 ? 'Free' : `$${item.amount.toFixed(2)}`}
                        </td>
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
                      <span>{selectedInvoice.subtotal === 0 ? 'Free' : `$${selectedInvoice.subtotal.toFixed(2)}`}</span>
                    </div>
                    {selectedInvoice.taxRate > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Tax ({selectedInvoice.taxRate}%):</span>
                        <span>${selectedInvoice.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                      <span>Total:</span>
                      <span>
                        {calculateTotal(selectedInvoice) === 0 
                          ? 'Free' 
                          : `$${calculateTotal(selectedInvoice).toFixed(2)} ${selectedInvoice.currency}`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-6">
                <Button 
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Download PDF button clicked for:', selectedInvoice?.invoiceNumber);
                    downloadInvoicePDF();
                  }}
                  className="bg-[#0958d9] hover:bg-[#24AC4A] flex items-center"
                  disabled={!selectedInvoice}
                >
                  <FiDownload className="mr-2" />
                  Download PDF
                </Button>
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">{selectedInvoice.notes}</p>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
