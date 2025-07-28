import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { LeadGenerationIndustry } from './lead-generation-industry.entity';

@Entity('lead_generation_results')
export class LeadGenerationResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @Column()
  contactPerson: string;

  @Column()
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column()
  companyWebsite: string;

  @Column()
  companySize: string;

  @Column()
  industry: string;

  @Column()
  location: string;

  @Column({ default: 'prospect' })
  status: string; // prospect, contacted, interested, qualified, converted

  @Column('text', { nullable: true })
  notes: string;

  @Column({ nullable: true })
  lastContactDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => LeadGenerationIndustry, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: LeadGenerationIndustry;

  @Column()
  roleId: number;
}
