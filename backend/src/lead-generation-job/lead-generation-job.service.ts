// backend/src/lead-generation-job/lead-generation-job.service.ts
import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeadGenerationJob } from './lead-generation-job.entity';
import { CreateLeadGenerationJobDto } from './dto/create-lead-generation-job.dto';
import { RoleService } from '../roles/role.service';
import { Role } from '../roles/role.entity';

@Injectable()
export class LeadGenerationJobService {
  constructor(
    @InjectRepository(LeadGenerationJob)
    private readonly leadGenerationJobRepository: Repository<LeadGenerationJob>,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
  ) {}

  async create(createLeadGenerationJobDto: CreateLeadGenerationJobDto): Promise<LeadGenerationJob> {
    try {
      // Create the Lead Generation Job first
      const leadGenerationJob = this.leadGenerationJobRepository.create({
        ...createLeadGenerationJobDto,
        status: 'active' // Set default status
      });
      const savedLeadGenerationJob = await this.leadGenerationJobRepository.save(leadGenerationJob);

      // Check if the client already has a client number for Lead Generation service (tag 4000)
      let clientNo = await this.roleService.getClientNoForClientAndService(
        createLeadGenerationJobDto.userId, 
        4000
      );
      
      if (clientNo === null) {
        // New client for Lead Generation, get the next available client number
        clientNo = await this.roleService.getNextAvailableClientNo(4000);
      }

      // Create corresponding entry in roles table
      const roleData = {
        name: Role.getServiceName(4000), // Gets "Lead Generation"
        clientNo: clientNo,
        serviceTag: 4000, // Lead Generation service tag
        clientId: createLeadGenerationJobDto.userId,
        leadGenerationJobId: savedLeadGenerationJob.id
      };

      await this.roleService.create(roleData);

      return savedLeadGenerationJob;
    } catch (error) {
      throw new BadRequestException('Failed to create lead generation job: ' + error.message);
    }
  }

  async findAll(): Promise<LeadGenerationJob[]> {
    return await this.leadGenerationJobRepository.find({
      where: { isDeleted: false },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUserId(userId: number): Promise<LeadGenerationJob[]> {
    return await this.leadGenerationJobRepository.find({
      where: { userId, isDeleted: false },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number): Promise<LeadGenerationJob> {
    const leadGenerationJob = await this.leadGenerationJobRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['user']
    });

    if (!leadGenerationJob) {
      throw new NotFoundException('Lead generation job not found');
    }

    return leadGenerationJob;
  }

  async findAllDeleted(): Promise<LeadGenerationJob[]> {
    return await this.leadGenerationJobRepository.find({
      where: { isDeleted: true },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findDeletedByUserId(userId: number): Promise<LeadGenerationJob[]> {
    return await this.leadGenerationJobRepository.find({
      where: { userId, isDeleted: true },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: number, updateData: Partial<CreateLeadGenerationJobDto>): Promise<LeadGenerationJob> {
    const leadGenerationJob = await this.findById(id);
    
    Object.assign(leadGenerationJob, updateData);
    const updatedJob = await this.leadGenerationJobRepository.save(leadGenerationJob);

    return updatedJob;
  }

  async delete(id: number): Promise<void> {
    const leadGenerationJob = await this.findById(id);
    
    // Soft delete the Lead Generation Job
    leadGenerationJob.isDeleted = true;
    await this.leadGenerationJobRepository.save(leadGenerationJob);
    
    // Also soft delete the corresponding role in roles table
    const roles = await this.roleService.findByServiceTag(4000);
    const correspondingRole = roles.find(role => role.leadGenerationJobId === id);
    
    if (correspondingRole) {
      await this.roleService.softDelete(correspondingRole.id);
    }
  }

  async hardDelete(id: number): Promise<void> {
    const leadGenerationJob = await this.leadGenerationJobRepository.findOne({
      where: { id }, // Find even if soft deleted
      relations: ['user']
    });

    if (!leadGenerationJob) {
      throw new NotFoundException('Lead generation job not found');
    }
    
    // Hard delete the corresponding role in roles table first
    const allRoles = await this.roleService.findAllIncludingDeleted();
    const correspondingRole = allRoles.find(role => role.leadGenerationJobId === id);
    
    if (correspondingRole) {
      await this.roleService.hardDelete(correspondingRole.id);
    }

    // Hard delete the Lead Generation Job
    await this.leadGenerationJobRepository.remove(leadGenerationJob);
  }

  async restore(id: number): Promise<LeadGenerationJob> {
    const leadGenerationJob = await this.leadGenerationJobRepository.findOne({
      where: { id }, // Find even if soft deleted
      relations: ['user']
    });

    if (!leadGenerationJob) {
      throw new NotFoundException('Lead generation job not found');
    }

    // Restore the Lead Generation Job
    leadGenerationJob.isDeleted = false;
    const restoredJob = await this.leadGenerationJobRepository.save(leadGenerationJob);
    
    // Also restore the corresponding role in roles table
    const allRoles = await this.roleService.findAllIncludingDeleted();
    const correspondingRole = allRoles.find(role => role.leadGenerationJobId === id);
    
    if (correspondingRole) {
      await this.roleService.update(correspondingRole.id, { isDeleted: false });
    }

    return restoredJob;
  }
}
