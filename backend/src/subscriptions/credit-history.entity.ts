import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { UserSubscription } from './user-subscription.entity';

@Entity('credit_history')
export class CreditHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  userSubscriptionId: number;

  @Column()
  actionType: string; // 'used', 'purchased', 'refunded', 'expired'

  @Column()
  creditAmount: number; // positive for purchased/refunded, negative for used

  @Column()
  remainingCreditsAfter: number; // credits remaining after this action

  @Column()
  serviceType: string; // 'cv-sourcing', 'prequalification', 'direct', 'lead-generation-job', 'lead-generation-industry'

  @Column()
  serviceTitle: string; // 'CV Sourcing', 'Prequalification', '360/Direct', 'Lead Generation'

  @Column({ nullable: true })
  roleTitle: string; // title of the role created (if applicable)

  @Column({ nullable: true })
  roleId: number; // ID of the role created (if applicable)

  @Column({ type: 'text', nullable: true })
  description: string; // human-readable description

  @Column({ type: 'text', nullable: true })
  metadata: string; // JSON string for additional data

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => UserSubscription)
  @JoinColumn({ name: 'userSubscriptionId' })
  userSubscription: UserSubscription;
}
