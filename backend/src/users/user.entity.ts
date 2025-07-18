// backend/src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // This creates a table named 'users'
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // Personal Information
  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  // Email addresses
  @Column({ name: 'company_email', unique: true, length: 255 })
  companymail: string;

  @Column({ name: 'personal_email', unique: true, length: 255 })
  email: string;

  // Authentication
  @Column({ length: 255 })
  password: string;

  // Company Information
  @Column({ name: 'company_name', length: 255 })
  companyName: string;

  @Column({ name: 'company_size', length: 50 })
  companySize: string;

  // Contact Information
  @Column({ length: 20 })
  phone: string;

  // Profile Information
  @Column({ name: 'avatar_url', nullable: true, length: 500 })
  avatar: string;

  // Account Status
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  // Subscription Information
  @Column({ name: 'subscription_status', default: 'inactive', length: 50 })
  subscriptionStatus: string;

  @Column({ name: 'subscription_plan', nullable: true, length: 100 })
  subscriptionPlan: string;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Last login tracking
  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;
}
