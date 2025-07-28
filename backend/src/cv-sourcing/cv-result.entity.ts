import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { CvSourcingRole } from './cv-sourcing.entity';

@Entity('cv_results')
export class CvResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  candidateName: string;

  @Column()
  candidateEmail: string;

  @Column({ nullable: true })
  candidatePhone: string;

  @Column()
  cvUrl: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column()
  experience: string;

  @Column()
  skills: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  expectedSalary: string;

  @Column({ default: 'pending' })
  status: string; // pending, reviewed, shortlisted, rejected

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => CvSourcingRole, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: CvSourcingRole;

  @Column()
  roleId: number;
}
