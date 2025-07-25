import { CreateInvoiceDto } from './create-invoice.dto';

export class UpdateInvoiceDto {
  userId?: number;
  userSubscriptionId?: number;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  total?: number;
  currency?: string;
  status?: string;
  notes?: string;
  paymentMethod?: string;
  items?: any[];
  billingAddress?: any;
  companyInfo?: any;
}
