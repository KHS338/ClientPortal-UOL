import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { LeadGenerationJob } from './lead-generation-job.entity';

@Entity('lead_generation_job_results')
export class LeadGenerationJobResult {
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
  jobTitle: string;

  @Column()
  industryType: string;

  @Column()
  companySize: string;

  @Column()
  workType: string;

  @Column()
  location: string;

  @Column()
  experienceRequired: string;

  @Column('text', { nullable: true })
  jobDescription: string;

  @Column({ default: 'prospect' })
  status: string; // prospect, contacted, interested, qualified, converted

  @Column('text', { nullable: true })
  notes: string;

  @Column({ nullable: true })
  lastContactDate: Date;

  @Column({ nullable: true })
  hiringUrgency: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => LeadGenerationJob, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: LeadGenerationJob;

  @Column()
  roleId: number;
}
