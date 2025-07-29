// backend/src/direct/direct.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('direct_roles')
export class DirectRole {
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

  // Tracking fields for direct approach
  @Column({ name: 'contacts_approached', type: 'int', default: 0 })
  contactsApproached: number;

  @Column({ name: 'responses_received', type: 'int', default: 0 })
  responsesReceived: number;

  @Column({ name: 'meetings_scheduled', type: 'int', default: 0 })
  meetingsScheduled: number;

  @Column({ name: 'successful_placements', type: 'int', default: 0 })
  successfulPlacements: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
