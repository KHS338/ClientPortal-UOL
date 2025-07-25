import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UserSubscription } from '../subscriptions/user-subscription.entity';
import { User } from '../users/user.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(UserSubscription)
    private userSubscriptionRepository: Repository<UserSubscription>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    // Verify user subscription exists
    const userSubscription = await this.userSubscriptionRepository.findOne({
      where: { id: createInvoiceDto.userSubscriptionId },
      relations: ['subscription']
    });

    if (!userSubscription) {
      throw new NotFoundException('User subscription not found');
    }

    // Generate invoice number if not provided
    const invoiceNumber = createInvoiceDto.invoiceNumber || await this.generateInvoiceNumber();

    // Set default dates
    const invoiceDate = createInvoiceDto.invoiceDate ? new Date(createInvoiceDto.invoiceDate) : new Date();
    const dueDate = createInvoiceDto.dueDate ? new Date(createInvoiceDto.dueDate) : this.calculateDueDate(invoiceDate);

    // Calculate tax and total
    const taxRate = createInvoiceDto.taxRate || 8; // Default 8%
    const taxAmount = createInvoiceDto.taxAmount || (createInvoiceDto.subtotal * (taxRate / 100));
    const total = createInvoiceDto.total || (createInvoiceDto.subtotal + taxAmount);

    // Get default company info
    const companyInfo = createInvoiceDto.companyInfo || {
      name: "ClientPortal UOL",
      address: "123 Business Street, Suite 100",
      city: "New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "billing@clientportal-uol.com"
    };

    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      invoiceNumber,
      invoiceDate,
      dueDate,
      taxRate,
      taxAmount,
      total,
      currency: createInvoiceDto.currency || 'USD',
      status: createInvoiceDto.status || 'pending',
      companyInfo
    });

    return await this.invoiceRepository.save(invoice);
  }

  async findAll(): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      relations: ['user', 'userSubscription', 'userSubscription.subscription'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUserId(userId: number): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { userId },
      relations: ['userSubscription', 'userSubscription.subscription'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['user', 'userSubscription', 'userSubscription.subscription']
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { invoiceNumber },
      relations: ['user', 'userSubscription', 'userSubscription.subscription']
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);

    // Recalculate tax and total if subtotal or tax rate changes
    if (updateInvoiceDto.subtotal !== undefined || updateInvoiceDto.taxRate !== undefined) {
      const subtotal = updateInvoiceDto.subtotal !== undefined ? updateInvoiceDto.subtotal : invoice.subtotal;
      const taxRate = updateInvoiceDto.taxRate !== undefined ? updateInvoiceDto.taxRate : invoice.taxRate;
      
      updateInvoiceDto.taxAmount = subtotal * (taxRate / 100);
      updateInvoiceDto.total = subtotal + updateInvoiceDto.taxAmount;
    }

    Object.assign(invoice, updateInvoiceDto);
    return await this.invoiceRepository.save(invoice);
  }

  async remove(id: number): Promise<void> {
    const invoice = await this.findOne(id);
    await this.invoiceRepository.remove(invoice);
  }

  async generateInvoiceForSubscription(userSubscriptionId: number): Promise<Invoice> {
    const userSubscription = await this.userSubscriptionRepository.findOne({
      where: { id: userSubscriptionId },
      relations: ['subscription', 'user']
    });

    if (!userSubscription) {
      throw new NotFoundException('User subscription not found');
    }

    // Check if invoice already exists for this subscription
    const existingInvoice = await this.invoiceRepository.findOne({
      where: { userSubscriptionId }
    });

    if (existingInvoice) {
      return existingInvoice; // Return existing invoice
    }

    // Calculate invoice items based on subscription
    const serviceName = userSubscription.subscription.title;
    const credits = userSubscription.totalCredits;
    const paidAmount = userSubscription.paidAmount;

    const items = [{
      description: `${serviceName} Service - ${credits} Credits`,
      quantity: credits,
      rate: credits > 0 ? paidAmount / credits : 0,
      amount: paidAmount,
      period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }];

    // Get user billing info
    const user = userSubscription.user;
    const billingAddress = {
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Client User',
      email: user.email,
      address: '456 Client Avenue', // TODO: Add address fields to User entity
      city: 'San Francisco, CA 94102', // TODO: Add city field to User entity
      clientNumber: `CL-${String(user.id).padStart(5, '0')}`,
      companyName: user.companyName || 'Client Company'
    };

    const createInvoiceDto: CreateInvoiceDto = {
      userId: userSubscription.userId,
      userSubscriptionId: userSubscription.id,
      subtotal: paidAmount,
      taxRate: serviceName === 'Free Trial' ? 0 : 8,
      items,
      billingAddress,
      notes: serviceName === 'Free Trial' 
        ? "Thank you for trying ClientPortal UOL. Free trial credits are complimentary."
        : "Thank you for choosing ClientPortal UOL. Payment terms: Net 15 days.",
      paymentMethod: 'Credit Card',
      status: userSubscription.status === 'active' ? 'paid' : 'pending'
    };

    return await this.create(createInvoiceDto);
  }

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Get the count of invoices for this month
    const startOfMonth = new Date(year, new Date().getMonth(), 1);
    const endOfMonth = new Date(year, new Date().getMonth() + 1, 0);
    
    const count = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .where('invoice.invoiceDate >= :startOfMonth', { startOfMonth })
      .andWhere('invoice.invoiceDate <= :endOfMonth', { endOfMonth })
      .getCount();

    return `INV-${year}-${month}-${String(count + 1).padStart(4, '0')}`;
  }

  private calculateDueDate(invoiceDate: Date): Date {
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 15); // 15 days payment terms
    return dueDate;
  }

  async markAsPaid(id: number, paymentMethod?: string): Promise<Invoice> {
    const invoice = await this.findOne(id);
    invoice.status = 'paid';
    if (paymentMethod) {
      invoice.paymentMethod = paymentMethod;
    }
    return await this.invoiceRepository.save(invoice);
  }

  async getInvoiceStats(userId?: number) {
    const whereClause = userId ? { userId } : {};
    
    const [total, paid, pending, overdue] = await Promise.all([
      this.invoiceRepository.count({ where: whereClause }),
      this.invoiceRepository.count({ where: { ...whereClause, status: 'paid' } }),
      this.invoiceRepository.count({ where: { ...whereClause, status: 'pending' } }),
      this.invoiceRepository.count({ where: { ...whereClause, status: 'overdue' } })
    ]);

    const totalAmount = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total)', 'sum')
      .where(userId ? 'invoice.userId = :userId' : '1=1', { userId })
      .getRawOne();

    const paidAmount = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total)', 'sum')
      .where('invoice.status = :status', { status: 'paid' })
      .andWhere(userId ? 'invoice.userId = :userId' : '1=1', { userId })
      .getRawOne();

    return {
      total,
      paid,
      pending,
      overdue,
      totalAmount: parseFloat(totalAmount.sum) || 0,
      paidAmount: parseFloat(paidAmount.sum) || 0
    };
  }
}
