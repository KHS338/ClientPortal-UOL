// backend/src/cv-sourcing/cv-sourcing.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('cv_sourcing_roles')
export class CvSourcingRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_title', length: 255 })
  roleTitle: string;

  @Column({ name: 'role_priority', length: 100 })
  rolePriority: string;

  @Column({ length: 255 })
  location: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ name: 'salary_from', type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaryFrom: number;

  @Column({ name: 'salary_to', type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaryTo: number;

  @Column({ name: 'salary_currency', length: 10, nullable: true, default: 'USD' })
  salaryCurrency: string;

  @Column({ name: 'salary_type', length: 50, nullable: true })
  salaryType: string;

  @Column({ name: 'salary_not_defined', default: false })
  salaryNotDefined: boolean;

  @Column({ length: 100, nullable: true })
  industry: string;

  @Column({ name: 'experience_required', length: 100, nullable: true })
  experienceRequired: string;

  @Column({ name: 'search_radius', type: 'int', nullable: true })
  searchRadius: number;

  @Column({ name: 'acm_category', length: 100, nullable: true })
  acmCategory: string;

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

  // Tracking fields for CVs and candidates
  @Column({ name: 'cvs_count', type: 'int', default: 0 })
  cvsCount: number;

  @Column({ name: 'lis_count', type: 'int', default: 0 })
  lisCount: number;

  @Column({ name: 'zi_count', type: 'int', default: 0 })
  ziCount: number;

  @Column({ name: 'total_candidates', type: 'int', default: 0 })
  totalCandidates: number;

  @Column({ name: 'rejected_cvs', type: 'int', default: 0 })
  rejectedCvs: number;

  @Column({ name: 'rejected_lis', type: 'int', default: 0 })
  rejectedLis: number;

  @Column({ name: 'qualified_candidates', type: 'int', default: 0 })
  qualifiedCandidates: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
