import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { UserSubscription } from '../subscriptions/user-subscription.entity';

// Custom transformer for decimal fields
const DecimalTransformer = {
  to: (value: number) => value,
  from: (value: string) => value ? parseFloat(value) : value,
};

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column()
  userId: number;

  @Column()
  userSubscriptionId: number;

  @Column({ type: 'date' })
  invoiceDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: DecimalTransformer })
  subtotal: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, transformer: DecimalTransformer })
  taxRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: DecimalTransformer })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: DecimalTransformer })
  total: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ default: 'pending' })
  status: string; // 'pending', 'paid', 'overdue', 'cancelled'

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ type: 'json', nullable: true })
  items: any; // Store invoice line items as JSON

  @Column({ type: 'json', nullable: true })
  billingAddress: any; // Store billing address as JSON

  @Column({ type: 'json', nullable: true })
  companyInfo: any; // Store company information as JSON

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => UserSubscription)
  @JoinColumn({ name: 'userSubscriptionId' })
  userSubscription: UserSubscription;
}
