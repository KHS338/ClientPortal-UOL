// backend/src/lead-generation-job/lead-generation-job.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('lead_generation_job')
export class LeadGenerationJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'job_title', length: 255 })
  jobTitle: string;

  @Column({ name: 'industry_type', length: 255 })
  industryType: string;

  @Column({ name: 'company_size', length: 100 })
  companySize: string;

  @Column({ name: 'work_type', length: 100 })
  workType: string;

  @Column({ length: 255 })
  location: string;

  @Column({ length: 100 })
  experience: string;

  @Column({ type: 'simple-array', nullable: true })
  skills: string[];

  @Column({ name: 'hiring_urgency', length: 100 })
  hiringUrgency: string;

  @Column({ name: 'is_recruitment_agency', length: 10, default: 'No' })
  isRecruitmentAgency: string;

  @Column({ name: 'special_instructions', nullable: true, type: 'text' })
  specialInstructions: string;

  @Column({ name: 'file_path', nullable: true, length: 500 })
  filePath: string;

  // Relationship with User
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Status tracking
  @Column({ length: 50, default: 'active' })
  status: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
