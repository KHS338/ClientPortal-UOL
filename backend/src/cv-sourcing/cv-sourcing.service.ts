// backend/src/cv-sourcing/cv-sourcing.service.ts
import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvSourcingRole } from './cv-sourcing.entity';
import { CreateCvSourcingDto } from './dto/create-cv-sourcing.dto';
import { RoleService } from '../roles/role.service';
import { Role } from '../roles/role.entity';

@Injectable()
export class CvSourcingService {
  constructor(
    @InjectRepository(CvSourcingRole)
    private readonly cvSourcingRepository: Repository<CvSourcingRole>,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
  ) {}

  async create(createCvSourcingDto: CreateCvSourcingDto): Promise<CvSourcingRole> {
    try {
      // Create the CV sourcing role first
      const cvSourcingRole = this.cvSourcingRepository.create({
        ...createCvSourcingDto,
        status: 'active' // Set default status
      });
      const savedCvSourcingRole = await this.cvSourcingRepository.save(cvSourcingRole);

      // Check if the client already has a client number for CV sourcing service (tag 1000)
      let clientNo = await this.roleService.getClientNoForClientAndService(
        createCvSourcingDto.userId, 
        1000
      );
      
      if (clientNo === null) {
        // New client for CV sourcing, get the next available client number
        clientNo = await this.roleService.getNextAvailableClientNo(1000);
      }

      // Create corresponding entry in roles table
      const roleData = {
        name: Role.getServiceName(1000), // Gets "CV Sourcing"
        clientNo: clientNo,
        serviceTag: 1000, // CV Sourcing service tag
        clientId: createCvSourcingDto.userId,
        cvSourcingRoleId: savedCvSourcingRole.id
      };

      await this.roleService.create(roleData);

      return savedCvSourcingRole;
    } catch (error) {
      throw new BadRequestException('Failed to create CV sourcing role: ' + error.message);
    }
  }

  async findAll(): Promise<CvSourcingRole[]> {
    return await this.cvSourcingRepository.find({
      where: { isDeleted: false },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUserId(userId: number): Promise<CvSourcingRole[]> {
    return await this.cvSourcingRepository.find({
      where: { userId, isDeleted: false },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number): Promise<CvSourcingRole> {
    const cvSourcingRole = await this.cvSourcingRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['user']
    });

    if (!cvSourcingRole) {
      throw new NotFoundException('CV sourcing role not found');
    }

    return cvSourcingRole;
  }

  async findAllDeleted(): Promise<CvSourcingRole[]> {
    return await this.cvSourcingRepository.find({
      where: { isDeleted: true },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findDeletedByUserId(userId: number): Promise<CvSourcingRole[]> {
    return await this.cvSourcingRepository.find({
      where: { userId, isDeleted: true },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: number, updateData: Partial<CreateCvSourcingDto>): Promise<CvSourcingRole> {
    const cvSourcingRole = await this.findById(id);
    
    Object.assign(cvSourcingRole, updateData);
    const updatedRole = await this.cvSourcingRepository.save(cvSourcingRole);

    // The role name in the roles table should always remain "CV Sourcing"
    // regardless of updates to the specific role title
    // No need to update the roles table name field

    return updatedRole;
  }

  async delete(id: number): Promise<void> {
    const cvSourcingRole = await this.findById(id);
    
    // Soft delete the CV sourcing role
    cvSourcingRole.isDeleted = true;
    await this.cvSourcingRepository.save(cvSourcingRole);
    
    // Also soft delete the corresponding role in roles table
    const roles = await this.roleService.findByServiceTag(1000);
    const correspondingRole = roles.find(role => role.cvSourcingRoleId === id);
    
    if (correspondingRole) {
      await this.roleService.softDelete(correspondingRole.id);
    }
  }

  async hardDelete(id: number): Promise<void> {
    const cvSourcingRole = await this.cvSourcingRepository.findOne({
      where: { id }, // Find even if soft deleted
      relations: ['user']
    });

    if (!cvSourcingRole) {
      throw new NotFoundException('CV sourcing role not found');
    }
    
    // Hard delete the corresponding role in roles table first
    const allRoles = await this.roleService.findAllIncludingDeleted();
    const correspondingRole = allRoles.find(role => role.cvSourcingRoleId === id);
    
    if (correspondingRole) {
      await this.roleService.hardDelete(correspondingRole.id);
    }

    // Hard delete the CV sourcing role
    await this.cvSourcingRepository.remove(cvSourcingRole);
  }

  async restore(id: number): Promise<CvSourcingRole> {
    const cvSourcingRole = await this.cvSourcingRepository.findOne({
      where: { id }, // Find even if soft deleted
      relations: ['user']
    });

    if (!cvSourcingRole) {
      throw new NotFoundException('CV sourcing role not found');
    }

    // Restore the CV sourcing role
    cvSourcingRole.isDeleted = false;
    const restoredRole = await this.cvSourcingRepository.save(cvSourcingRole);
    
    // Also restore the corresponding role in roles table
    const allRoles = await this.roleService.findAllIncludingDeleted();
    const correspondingRole = allRoles.find(role => role.cvSourcingRoleId === id);
    
    if (correspondingRole) {
      await this.roleService.update(correspondingRole.id, { isDeleted: false });
    }

    return restoredRole;
  }

  async updateCandidateCount(id: number, countType: string, increment: boolean = true): Promise<void> {
    const cvSourcingRole = await this.findById(id);
    
    const delta = increment ? 1 : -1;
    
    switch (countType) {
      case 'cvs':
        cvSourcingRole.cvsCount += delta;
        break;
      case 'lis':
        cvSourcingRole.lisCount += delta;
        break;
      case 'zi':
        cvSourcingRole.ziCount += delta;
        break;
      case 'rejectedCvs':
        cvSourcingRole.rejectedCvs += delta;
        break;
      case 'rejectedLis':
        cvSourcingRole.rejectedLis += delta;
        break;
      case 'qualified':
        cvSourcingRole.qualifiedCandidates += delta;
        break;
    }
    
    // Update total candidates
    cvSourcingRole.totalCandidates = 
      cvSourcingRole.cvsCount + 
      cvSourcingRole.lisCount + 
      cvSourcingRole.ziCount;
    
    await this.cvSourcingRepository.save(cvSourcingRole);
  }

  async updateCandidateCounts(id: number, counts: {
    cvsCount?: number;
    lisCount?: number;
    ziCount?: number;
    rejectedCvs?: number;
    rejectedLis?: number;
    qualifiedCandidates?: number;
  }): Promise<CvSourcingRole> {
    const cvSourcingRole = await this.findById(id);
    
    // Update individual counts if provided
    if (counts.cvsCount !== undefined) {
      cvSourcingRole.cvsCount = counts.cvsCount;
    }
    if (counts.lisCount !== undefined) {
      cvSourcingRole.lisCount = counts.lisCount;
    }
    if (counts.ziCount !== undefined) {
      cvSourcingRole.ziCount = counts.ziCount;
    }
    if (counts.rejectedCvs !== undefined) {
      cvSourcingRole.rejectedCvs = counts.rejectedCvs;
    }
    if (counts.rejectedLis !== undefined) {
      cvSourcingRole.rejectedLis = counts.rejectedLis;
    }
    if (counts.qualifiedCandidates !== undefined) {
      cvSourcingRole.qualifiedCandidates = counts.qualifiedCandidates;
    }
    
    // Update total candidates
    cvSourcingRole.totalCandidates = 
      cvSourcingRole.cvsCount + 
      cvSourcingRole.lisCount + 
      cvSourcingRole.ziCount;
    
    return await this.cvSourcingRepository.save(cvSourcingRole);
  }
}
