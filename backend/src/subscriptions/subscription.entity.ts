import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Custom transformer for decimal fields to ensure they are returned as numbers
const DecimalTransformer = {
  to: (value: number) => value,
  from: (value: string) => value ? parseFloat(value) : value,
};

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, transformer: DecimalTransformer })
  monthlyPrice: number;

  @Column({ nullable: true })
  monthlyPriceDisplay: string;

  @Column({ nullable: true })
  monthlyKey: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, transformer: DecimalTransformer })
  annualPrice: number;

  @Column({ nullable: true })
  annualPriceDisplay: string;

  @Column({ nullable: true })
  annualKey: string;

  @Column({ nullable: true })
  annualSavings: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, transformer: DecimalTransformer })
  adhocPrice: number;

  @Column({ nullable: true })
  adhocPriceDisplay: string;

  @Column({ nullable: true })
  adhocKey: string;

  @Column({ type: 'int', default: 0 })
  monthlyCredits: number;

  @Column({ type: 'int', default: 0 })
  annualCredits: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 50.00, transformer: DecimalTransformer })
  creditPrice: number;

  @Column({ type: 'simple-array' })
  features: string[];

  @Column({ default: false })
  isEnterprise: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
