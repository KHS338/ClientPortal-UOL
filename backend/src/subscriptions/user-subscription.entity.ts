import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Subscription } from '../subscriptions/subscription.entity';

// Custom transformer for decimal fields to ensure they are returned as numbers
const DecimalTransformer = {
  to: (value: number) => value,
  from: (value: string) => value ? parseFloat(value) : value,
};

@Entity('user_subscriptions')
export class UserSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  subscriptionId: number;

  @Column()
  billingCycle: string; // 'monthly', 'annual', 'adhoc'

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: DecimalTransformer })
  paidAmount: number;

  @Column()
  currency: string; // 'USD', 'GBP'

  @Column({ type: 'int', default: 0 })
  totalCredits: number;

  @Column({ type: 'int', default: 0 })
  usedCredits: number;

  @Column({ type: 'int', default: 0 })
  remainingCredits: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  nextRenewalDate: Date;

  @Column({ default: 'active' })
  status: string; // 'active', 'expired', 'cancelled', 'pending'

  @Column({ default: true })
  autoRenew: boolean;

  @Column({ nullable: true })
  paymentIntentId: string;

  @Column({ nullable: true })
  stripeSubscriptionId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Subscription)
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;
}
