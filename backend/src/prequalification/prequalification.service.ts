// backend/src/prequalification/prequalification.service.ts
import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrequalificationRole } from './prequalification.entity';
import { CreatePrequalificationDto } from './dto/create-prequalification.dto';
import { RoleService } from '../roles/role.service';
import { Role } from '../roles/role.entity';

@Injectable()
export class PrequalificationService {
  constructor(
    @InjectRepository(PrequalificationRole)
    private readonly prequalificationRepository: Repository<PrequalificationRole>,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
  ) {}

  async create(createPrequalificationDto: CreatePrequalificationDto): Promise<PrequalificationRole> {
    try {
      // Create the prequalification role first
      const prequalificationRole = this.prequalificationRepository.create({
        ...createPrequalificationDto,
        status: 'active' // Set default status
      });
      const savedPrequalificationRole = await this.prequalificationRepository.save(prequalificationRole);

      // Check if the client already has a client number for Pre-qualification service (tag 2000)
      let clientNo = await this.roleService.getClientNoForClientAndService(
        createPrequalificationDto.userId, 
        2000
      );
      
      if (clientNo === null) {
        // New client for Pre-qualification, get the next available client number
        clientNo = await this.roleService.getNextAvailableClientNo(2000);
      }

      // Create corresponding entry in roles table
      const roleData = {
        name: Role.getServiceName(2000), // Gets "Pre-qualification"
        clientNo: clientNo,
        serviceTag: 2000, // Pre-qualification service tag
        clientId: createPrequalificationDto.userId,
        prequalificationRoleId: savedPrequalificationRole.id
      };

      await this.roleService.create(roleData);

      return savedPrequalificationRole;
    } catch (error) {
      throw new BadRequestException('Failed to create pre-qualification role: ' + error.message);
    }
  }

  async findAll(): Promise<PrequalificationRole[]> {
    return await this.prequalificationRepository.find({
      where: { isDeleted: false },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUserId(userId: number): Promise<PrequalificationRole[]> {
    return await this.prequalificationRepository.find({
      where: { userId, isDeleted: false },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number): Promise<PrequalificationRole> {
    const prequalificationRole = await this.prequalificationRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['user']
    });

    if (!prequalificationRole) {
      throw new NotFoundException('Pre-qualification role not found');
    }

    return prequalificationRole;
  }

  async findAllDeleted(): Promise<PrequalificationRole[]> {
    return await this.prequalificationRepository.find({
      where: { isDeleted: true },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findDeletedByUserId(userId: number): Promise<PrequalificationRole[]> {
    return await this.prequalificationRepository.find({
      where: { userId, isDeleted: true },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: number, updateData: Partial<CreatePrequalificationDto>): Promise<PrequalificationRole> {
    const prequalificationRole = await this.findById(id);
    
    Object.assign(prequalificationRole, updateData);
    const updatedRole = await this.prequalificationRepository.save(prequalificationRole);

    // The role name in the roles table should always remain "Pre-qualification"
    // regardless of updates to the specific role title
    // No need to update the roles table name field

    return updatedRole;
  }

  async delete(id: number): Promise<void> {
    const prequalificationRole = await this.findById(id);
    
    // Soft delete the prequalification role
    prequalificationRole.isDeleted = true;
    await this.prequalificationRepository.save(prequalificationRole);
    
    // Also soft delete the corresponding role in roles table
    const roles = await this.roleService.findByServiceTag(2000);
    const correspondingRole = roles.find(role => role.prequalificationRoleId === id);
    
    if (correspondingRole) {
      await this.roleService.softDelete(correspondingRole.id);
    }
  }

  async hardDelete(id: number): Promise<void> {
    const prequalificationRole = await this.prequalificationRepository.findOne({
      where: { id }, // Find even if soft deleted
      relations: ['user']
    });

    if (!prequalificationRole) {
      throw new NotFoundException('Pre-qualification role not found');
    }
    
    // Hard delete the corresponding role in roles table first
    const allRoles = await this.roleService.findAllIncludingDeleted();
    const correspondingRole = allRoles.find(role => role.prequalificationRoleId === id);
    
    if (correspondingRole) {
      await this.roleService.hardDelete(correspondingRole.id);
    }

    // Hard delete the prequalification role
    await this.prequalificationRepository.remove(prequalificationRole);
  }

  async restore(id: number): Promise<PrequalificationRole> {
    const prequalificationRole = await this.prequalificationRepository.findOne({
      where: { id }, // Find even if soft deleted
      relations: ['user']
    });

    if (!prequalificationRole) {
      throw new NotFoundException('Pre-qualification role not found');
    }

    // Restore the prequalification role
    prequalificationRole.isDeleted = false;
    const restoredRole = await this.prequalificationRepository.save(prequalificationRole);
    
    // Also restore the corresponding role in roles table
    const allRoles = await this.roleService.findAllIncludingDeleted();
    const correspondingRole = allRoles.find(role => role.prequalificationRoleId === id);
    
    if (correspondingRole) {
      await this.roleService.update(correspondingRole.id, { isDeleted: false });
    }

    return restoredRole;
  }

  async updateCandidateCount(id: number, countType: string, increment: boolean = true): Promise<void> {
    const prequalificationRole = await this.findById(id);
    
    const delta = increment ? 1 : -1;
    
    switch (countType) {
      case 'submitted':
        prequalificationRole.candidatesSubmitted += delta;
        break;
      case 'qualified':
        prequalificationRole.candidatesQualified += delta;
        break;
      case 'rejected':
        prequalificationRole.candidatesRejected += delta;
        break;
      case 'interviews':
        prequalificationRole.interviewsScheduled += delta;
        break;
    }
    
    await this.prequalificationRepository.save(prequalificationRole);
  }

  async updateCandidateCounts(id: number, counts: {
    candidatesSubmitted?: number;
    candidatesQualified?: number;
    candidatesRejected?: number;
    interviewsScheduled?: number;
  }): Promise<PrequalificationRole> {
    const prequalificationRole = await this.findById(id);
    
    // Update individual counts if provided
    if (counts.candidatesSubmitted !== undefined) {
      prequalificationRole.candidatesSubmitted = counts.candidatesSubmitted;
    }
    if (counts.candidatesQualified !== undefined) {
      prequalificationRole.candidatesQualified = counts.candidatesQualified;
    }
    if (counts.candidatesRejected !== undefined) {
      prequalificationRole.candidatesRejected = counts.candidatesRejected;
    }
    if (counts.interviewsScheduled !== undefined) {
      prequalificationRole.interviewsScheduled = counts.interviewsScheduled;
    }
    
    return await this.prequalificationRepository.save(prequalificationRole);
  }
}
