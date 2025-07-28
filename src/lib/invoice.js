import { authUtils } from './auth';

/**
 * Invoice utility functions for managing invoices
 */

/**
 * Get all invoices for a user
 * @param {number} userId - The user ID
 * @returns {Promise<Array>} Array of invoices
 */
export const getUserInvoices = async (userId) => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await authUtils.fetchWithAuth(`${apiBaseUrl}/invoices/user/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const invoices = await response.json();
    return invoices || [];
  } catch (error) {
    console.error('Error fetching user invoices:', error);
    return [];
  }
};

/**
 * Get a single invoice by ID
 * @param {number} invoiceId - The invoice ID
 * @returns {Promise<Object|null>} Invoice object or null
 */
export const getInvoice = async (invoiceId) => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await authUtils.fetchWithAuth(`${apiBaseUrl}/invoices/${invoiceId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
};

/**
 * Get invoice by invoice number
 * @param {string} invoiceNumber - The invoice number
 * @returns {Promise<Object|null>} Invoice object or null
 */
export const getInvoiceByNumber = async (invoiceNumber) => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await authUtils.fetchWithAuth(`${apiBaseUrl}/invoices/number/${invoiceNumber}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching invoice by number:', error);
    return null;
  }
};

/**
 * Generate invoice for a subscription
 * @param {number} userSubscriptionId - The user subscription ID
 * @returns {Promise<Object|null>} Generated invoice or null
 */
export const generateInvoiceForSubscription = async (userSubscriptionId) => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await authUtils.fetchWithAuth(`${apiBaseUrl}/invoices/generate/${userSubscriptionId}`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const invoice = await response.json();
    
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('invoiceGenerated', { 
      detail: invoice 
    }));
    
    return invoice;
  } catch (error) {
    console.error('Error generating invoice for subscription:', error);
    return null;
  }
};

/**
 * Mark invoice as paid
 * @param {number} invoiceId - The invoice ID
 * @param {string} paymentMethod - The payment method used
 * @returns {Promise<Object|null>} Updated invoice or null
 */
export const markInvoiceAsPaid = async (invoiceId, paymentMethod = 'Credit Card') => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await authUtils.fetchWithAuth(`${apiBaseUrl}/invoices/${invoiceId}/mark-paid`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentMethod })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const invoice = await response.json();
    
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('invoiceUpdated', { 
      detail: invoice 
    }));
    
    return invoice;
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    return null;
  }
};

/**
 * Create a new invoice
 * @param {Object} invoiceData - Invoice data
 * @returns {Promise<Object|null>} Created invoice or null
 */
export const createInvoice = async (invoiceData) => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await authUtils.fetchWithAuth(`${apiBaseUrl}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoiceData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const invoice = await response.json();
    
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('invoiceCreated', { 
      detail: invoice 
    }));
    
    return invoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    return null;
  }
};

/**
 * Update an invoice
 * @param {number} invoiceId - The invoice ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated invoice or null
 */
export const updateInvoice = async (invoiceId, updateData) => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await authUtils.fetchWithAuth(`${apiBaseUrl}/invoices/${invoiceId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const invoice = await response.json();
    
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('invoiceUpdated', { 
      detail: invoice 
    }));
    
    return invoice;
  } catch (error) {
    console.error('Error updating invoice:', error);
    return null;
  }
};

/**
 * Get invoice statistics
 * @param {number} userId - Optional user ID to filter by
 * @returns {Promise<Object>} Invoice statistics
 */
export const getInvoiceStats = async (userId = null) => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = userId 
      ? `${apiBaseUrl}/invoices/stats?userId=${userId}`
      : `${apiBaseUrl}/invoices/stats`;
    
    const response = await authUtils.fetchWithAuth(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching invoice stats:', error);
    return {
      total: 0,
      paid: 0,
      pending: 0,
      overdue: 0,
      totalAmount: 0,
      paidAmount: 0
    };
  }
};

/**
 * Convert subscription data to invoice format (for backward compatibility)
 * @param {Object} subscription - Subscription object
 * @param {number} index - Index for invoice number generation
 * @returns {Object} Invoice-formatted object
 */
export const convertSubscriptionToInvoice = (subscription, index = 0) => {
  // Handle different date formats from backend
  let invoiceDate;
  const dateSource = subscription.startDate || subscription.purchaseDate || subscription.createdAt;
  
  if (dateSource) {
    invoiceDate = new Date(dateSource);
    if (isNaN(invoiceDate.getTime())) {
      console.warn('Invalid date found in subscription:', dateSource);
      invoiceDate = new Date();
    }
  } else {
    invoiceDate = new Date();
  }

  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 15);

  // Get service name from subscription relationship
  const serviceName = subscription.subscription?.title || subscription.service || 'Unknown Service';
  const serviceCredits = subscription.totalCredits || subscription.credits || 0;
  const paidAmount = subscription.paidAmount || 0;

  // Generate invoice number
  const year = invoiceDate.getFullYear();
  const month = String(invoiceDate.getMonth() + 1).padStart(2, '0');
  const invoiceNumber = `INV-${year}-${month}-${String(index + 1).padStart(4, '0')}`;

  return {
    id: subscription.id || `temp-${index}`,
    invoiceNumber,
    invoiceDate: invoiceDate.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    status: subscription.status === 'active' ? 'paid' : 'pending',
    currency: subscription.currency || 'USD',
    subtotal: paidAmount,
    taxRate: serviceName === 'Free Trial' ? 0 : 8,
    taxAmount: serviceName === 'Free Trial' ? 0 : paidAmount * 0.08,
    total: serviceName === 'Free Trial' ? 0 : paidAmount * 1.08,
    items: [{
      description: `${serviceName} Service - ${serviceCredits} Credits`,
      quantity: serviceCredits,
      rate: serviceCredits > 0 ? paidAmount / serviceCredits : 0,
      amount: paidAmount,
      period: invoiceDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }],
    billingAddress: {
      name: subscription.user ? `${subscription.user.firstName || ''} ${subscription.user.lastName || ''}`.trim() || 'Client User' : 'Client User',
      email: subscription.user?.email || 'user@example.com',
      address: '456 Client Avenue',
      city: 'San Francisco, CA 94102',
      clientNumber: `CL-${String(subscription.userId || 1).padStart(5, '0')}`,
      companyName: subscription.user?.companyName || 'Client Company'
    },
    companyInfo: {
      name: "ClientPortal UOL",
      address: "123 Business Street, Suite 100",
      city: "New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "billing@clientportal-uol.com"
    },
    notes: serviceName === 'Free Trial' 
      ? "Thank you for trying ClientPortal UOL. Free trial credits are complimentary."
      : "Thank you for choosing ClientPortal UOL. Payment terms: Net 15 days.",
    paymentMethod: 'Credit Card',
    service: serviceName,
    backendData: subscription
  };
};

const invoiceUtils = {
  getUserInvoices,
  getInvoice,
  getInvoiceByNumber,
  generateInvoiceForSubscription,
  markInvoiceAsPaid,
  createInvoice,
  updateInvoice,
  getInvoiceStats,
  convertSubscriptionToInvoice
};

export default invoiceUtils;
