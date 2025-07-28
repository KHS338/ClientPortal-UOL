import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { PrequalificationRole } from './prequalification.entity';

@Entity('prequalification_results')
export class PrequalificationResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  candidateName: string;

  @Column()
  candidateEmail: string;

  @Column({ nullable: true })
  candidatePhone: string;

  @Column()
  qualificationScore: number;

  @Column()
  assessmentUrl: string;

  @Column('text')
  assessmentSummary: string;

  @Column('text', { nullable: true })
  interviewNotes: string;

  @Column({ default: 'pending' })
  status: string; // pending, qualified, disqualified, in-review

  @Column({ nullable: true })
  nextSteps: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => PrequalificationRole, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: PrequalificationRole;

  @Column()
  roleId: number;
}
