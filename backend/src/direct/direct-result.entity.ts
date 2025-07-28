import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { DirectRole } from './direct.entity';

@Entity('direct_results')
export class DirectResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  candidateName: string;

  @Column()
  candidateEmail: string;

  @Column({ nullable: true })
  candidatePhone: string;

  @Column()
  sourceChannel: string; // LinkedIn, Indeed, Company Website, etc.

  @Column()
  profileUrl: string;

  @Column('text')
  candidateProfile: string;

  @Column({ nullable: true })
  contactDate: Date;

  @Column({ default: 'contacted' })
  status: string; // contacted, responded, interested, not-interested, hired

  @Column('text', { nullable: true })
  communicationNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => DirectRole, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: DirectRole;

  @Column()
  roleId: number;
}
