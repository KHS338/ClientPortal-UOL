// backend/src/lead-generation-industry/lead-generation-industry.service.ts
import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeadGenerationIndustry } from './lead-generation-industry.entity';
import { CreateLeadGenerationIndustryDto } from './dto/create-lead-generation-industry.dto';
import { RoleService } from '../roles/role.service';
import { Role } from '../roles/role.entity';

@Injectable()
export class LeadGenerationIndustryService {
  constructor(
    @InjectRepository(LeadGenerationIndustry)
    private readonly leadGenerationIndustryRepository: Repository<LeadGenerationIndustry>,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
  ) {}

  async create(createLeadGenerationIndustryDto: CreateLeadGenerationIndustryDto): Promise<LeadGenerationIndustry> {
    try {
      // Create the Lead Generation Industry first
      const leadGenerationIndustry = this.leadGenerationIndustryRepository.create({
        ...createLeadGenerationIndustryDto,
        status: 'active' // Set default status
      });
      const savedLeadGenerationIndustry = await this.leadGenerationIndustryRepository.save(leadGenerationIndustry);

      // Check if the client already has a client number for Lead Generation service (tag 4000)
      let clientNo = await this.roleService.getClientNoForClientAndService(
        createLeadGenerationIndustryDto.userId, 
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
        clientId: createLeadGenerationIndustryDto.userId,
        leadGenerationIndustryId: savedLeadGenerationIndustry.id
      };

      await this.roleService.create(roleData);

      return savedLeadGenerationIndustry;
    } catch (error) {
      throw new BadRequestException('Failed to create lead generation industry: ' + error.message);
    }
  }

  async findAll(): Promise<LeadGenerationIndustry[]> {
    return await this.leadGenerationIndustryRepository.find({
      where: { isDeleted: false },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUserId(userId: number): Promise<LeadGenerationIndustry[]> {
    return await this.leadGenerationIndustryRepository.find({
      where: { userId, isDeleted: false },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number): Promise<LeadGenerationIndustry> {
    const leadGenerationIndustry = await this.leadGenerationIndustryRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['user']
    });

    if (!leadGenerationIndustry) {
      throw new NotFoundException('Lead generation industry not found');
    }

    return leadGenerationIndustry;
  }

  async findAllDeleted(): Promise<LeadGenerationIndustry[]> {
    return await this.leadGenerationIndustryRepository.find({
      where: { isDeleted: true },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findDeletedByUserId(userId: number): Promise<LeadGenerationIndustry[]> {
    return await this.leadGenerationIndustryRepository.find({
      where: { userId, isDeleted: true },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: number, updateData: Partial<CreateLeadGenerationIndustryDto>): Promise<LeadGenerationIndustry> {
    const leadGenerationIndustry = await this.findById(id);
    
    Object.assign(leadGenerationIndustry, updateData);
    const updatedIndustry = await this.leadGenerationIndustryRepository.save(leadGenerationIndustry);

    return updatedIndustry;
  }

  async delete(id: number): Promise<void> {
    const leadGenerationIndustry = await this.findById(id);
    
    // Soft delete the Lead Generation Industry
    leadGenerationIndustry.isDeleted = true;
    await this.leadGenerationIndustryRepository.save(leadGenerationIndustry);
    
    // Also soft delete the corresponding role in roles table
    const roles = await this.roleService.findByServiceTag(4000);
    const correspondingRole = roles.find(role => role.leadGenerationIndustryId === id);
    
    if (correspondingRole) {
      await this.roleService.softDelete(correspondingRole.id);
    }
  }

  async hardDelete(id: number): Promise<void> {
    const leadGenerationIndustry = await this.leadGenerationIndustryRepository.findOne({
      where: { id }, // Find even if soft deleted
      relations: ['user']
    });

    if (!leadGenerationIndustry) {
      throw new NotFoundException('Lead generation industry not found');
    }
    
    // Hard delete the corresponding role in roles table first
    const allRoles = await this.roleService.findAllIncludingDeleted();
    const correspondingRole = allRoles.find(role => role.leadGenerationIndustryId === id);
    
    if (correspondingRole) {
      await this.roleService.hardDelete(correspondingRole.id);
    }

    // Hard delete the Lead Generation Industry
    await this.leadGenerationIndustryRepository.remove(leadGenerationIndustry);
  }

  async restore(id: number): Promise<LeadGenerationIndustry> {
    const leadGenerationIndustry = await this.leadGenerationIndustryRepository.findOne({
      where: { id }, // Find even if soft deleted
      relations: ['user']
    });

    if (!leadGenerationIndustry) {
      throw new NotFoundException('Lead generation industry not found');
    }

    // Restore the Lead Generation Industry
    leadGenerationIndustry.isDeleted = false;
    const restoredIndustry = await this.leadGenerationIndustryRepository.save(leadGenerationIndustry);
    
    // Also restore the corresponding role in roles table
    const allRoles = await this.roleService.findAllIncludingDeleted();
    const correspondingRole = allRoles.find(role => role.leadGenerationIndustryId === id);
    
    if (correspondingRole) {
      await this.roleService.update(correspondingRole.id, { isDeleted: false });
    }

    return restoredIndustry;
  }
}
