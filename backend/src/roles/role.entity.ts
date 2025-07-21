// backend/src/roles/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { CvSourcingRole } from '../cv-sourcing/cv-sourcing.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'client_no', type: 'int' })
  clientNo: number;

  @Column({ name: 'service_tag', type: 'int' })
  serviceTag: number;

  // Foreign key to User (clientID)
  @Column({ name: 'client_id' })
  clientId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  // Foreign key to CV Sourcing Role (nullable for other service types)
  @Column({ name: 'cv_sourcing_role_id', nullable: true })
  cvSourcingRoleId: number;

  @ManyToOne(() => CvSourcingRole)
  @JoinColumn({ name: 'cv_sourcing_role_id' })
  cvSourcingRole: CvSourcingRole;

  // Foreign key to Prequalification Role (nullable for other service types)
  @Column({ name: 'prequalification_role_id', nullable: true })
  prequalificationRoleId: number;

  // Foreign key to 360 Direct Role (nullable for other service types)
  @Column({ name: 'direct_role_id', nullable: true })
  directRoleId: number;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Helper method to get service type based on service tag
  getServiceType(): string {
    switch (this.serviceTag) {
      case 1000:
        return 'CV Sourcing';
      case 2000:
        return 'Pre-qualification';
      case 3000:
        return '360 Direct';
      case 4000:
        return 'Lead Generation';
      default:
        return 'Unknown';
    }
  }

  // Static method to get service name by service tag (for use in services)
  static getServiceName(serviceTag: number): string {
    switch (serviceTag) {
      case 1000:
        return 'CV Sourcing';
      case 2000:
        return 'Pre-qualification';
      case 3000:
        return '360 Direct';
      case 4000:
        return 'Lead Generation';
      default:
        return 'Unknown';
    }
  }

  // Helper method to validate client number range
  isValidClientNoForService(): boolean {
    if (this.serviceTag === 1000) {
      return this.clientNo >= 0 && this.clientNo <= 1000;
    } else if (this.serviceTag === 2000) {
      return this.clientNo >= 1001 && this.clientNo <= 2000;
    } else if (this.serviceTag === 3000) {
      return this.clientNo >= 2001 && this.clientNo <= 3000;
    } else if (this.serviceTag === 4000) {
      return this.clientNo >= 3001 && this.clientNo <= 4000;
    }
    return false;
  }
}
