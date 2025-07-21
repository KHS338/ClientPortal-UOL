// backend/src/lead-generation-industry/lead-generation-industry.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('lead_generation_industry')
export class LeadGenerationIndustry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'industry_type', length: 255 })
  industryType: string;

  @Column({ name: 'company_size', length: 100 })
  companySize: string;

  @Column({ name: 'city_country', length: 255 })
  cityCountry: string;

  @Column({ name: 'lead_priority', length: 100 })
  leadPriority: string;

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
