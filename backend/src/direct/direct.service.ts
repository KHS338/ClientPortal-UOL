// backend/src/direct/direct.service.ts
import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectRole } from './direct.entity';
import { CreateDirectDto } from './dto/create-direct.dto';
import { RoleService } from '../roles/role.service';
import { Role } from '../roles/role.entity';

@Injectable()
export class DirectService {
  constructor(
    @InjectRepository(DirectRole)
    private readonly directRepository: Repository<DirectRole>,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
  ) {}

  async create(createDirectDto: CreateDirectDto): Promise<DirectRole> {
    try {
      // Create the direct role first
      const directRole = this.directRepository.create({
        ...createDirectDto,
        status: 'active' // Set default status
      });
      const savedDirectRole = await this.directRepository.save(directRole);

      // Check if the client already has a client number for 360 Direct service (tag 3000)
      let clientNo = await this.roleService.getClientNoForClientAndService(
        createDirectDto.userId, 
        3000
      );
      
      if (clientNo === null) {
        // New client for 360 Direct, get the next available client number
        clientNo = await this.roleService.getNextAvailableClientNo(3000);
      }

      // Create corresponding entry in roles table
      const roleData = {
        name: Role.getServiceName(3000), // Gets "360 Direct"
        clientNo: clientNo,
        serviceTag: 3000, // 360 Direct service tag
        clientId: createDirectDto.userId,
        directRoleId: savedDirectRole.id
      };

      await this.roleService.create(roleData);

      return savedDirectRole;
    } catch (error) {
      throw new BadRequestException('Failed to create 360 direct role: ' + error.message);
    }
  }

  async findAll(): Promise<DirectRole[]> {
    return await this.directRepository.find({
      where: { isDeleted: false },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUserId(userId: number): Promise<DirectRole[]> {
    return await this.directRepository.find({
      where: { userId, isDeleted: false },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number): Promise<DirectRole> {
    const directRole = await this.directRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['user']
    });

    if (!directRole) {
      throw new NotFoundException('360 Direct role not found');
    }

    return directRole;
  }

  async findAllDeleted(): Promise<DirectRole[]> {
    return await this.directRepository.find({
      where: { isDeleted: true },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findDeletedByUserId(userId: number): Promise<DirectRole[]> {
    return await this.directRepository.find({
      where: { userId, isDeleted: true },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: number, updateData: Partial<CreateDirectDto>): Promise<DirectRole> {
    const directRole = await this.findById(id);
    
    Object.assign(directRole, updateData);
    const updatedRole = await this.directRepository.save(directRole);

    // The role name in the roles table should always remain "360 Direct"
    // regardless of updates to the specific role title
    // No need to update the roles table name field

    return updatedRole;
  }

  async delete(id: number): Promise<void> {
    const directRole = await this.findById(id);
    
    // Soft delete the direct role
    directRole.isDeleted = true;
    await this.directRepository.save(directRole);
    
    // Also soft delete the corresponding role in roles table
    const roles = await this.roleService.findByServiceTag(3000);
    const correspondingRole = roles.find(role => role.directRoleId === id);
    
    if (correspondingRole) {
      await this.roleService.softDelete(correspondingRole.id);
    }
  }

  async hardDelete(id: number): Promise<void> {
    const directRole = await this.directRepository.findOne({
      where: { id }, // Find even if soft deleted
      relations: ['user']
    });

    if (!directRole) {
      throw new NotFoundException('360 Direct role not found');
    }
    
    // Hard delete the corresponding role in roles table first
    const allRoles = await this.roleService.findAllIncludingDeleted();
    const correspondingRole = allRoles.find(role => role.directRoleId === id);
    
    if (correspondingRole) {
      await this.roleService.hardDelete(correspondingRole.id);
    }

    // Hard delete the direct role
    await this.directRepository.remove(directRole);
  }

  async restore(id: number): Promise<DirectRole> {
    const directRole = await this.directRepository.findOne({
      where: { id }, // Find even if soft deleted
      relations: ['user']
    });

    if (!directRole) {
      throw new NotFoundException('360 Direct role not found');
    }

    // Restore the direct role
    directRole.isDeleted = false;
    const restoredRole = await this.directRepository.save(directRole);
    
    // Also restore the corresponding role in roles table
    const allRoles = await this.roleService.findAllIncludingDeleted();
    const correspondingRole = allRoles.find(role => role.directRoleId === id);
    
    if (correspondingRole) {
      await this.roleService.update(correspondingRole.id, { isDeleted: false });
    }

    return restoredRole;
  }

  async updateActivityCount(id: number, countType: string, increment: boolean = true): Promise<void> {
    const directRole = await this.findById(id);
    
    const delta = increment ? 1 : -1;
    
    switch (countType) {
      case 'approached':
        directRole.contactsApproached += delta;
        break;
      case 'responses':
        directRole.responsesReceived += delta;
        break;
      case 'meetings':
        directRole.meetingsScheduled += delta;
        break;
      case 'placements':
        directRole.successfulPlacements += delta;
        break;
    }
    
    await this.directRepository.save(directRole);
  }

  async updateActivityCounts(id: number, counts: {
    contactsApproached?: number;
    responsesReceived?: number;
    meetingsScheduled?: number;
    successfulPlacements?: number;
  }): Promise<DirectRole> {
    const directRole = await this.findById(id);
    
    // Update individual counts if provided
    if (counts.contactsApproached !== undefined) {
      directRole.contactsApproached = counts.contactsApproached;
    }
    if (counts.responsesReceived !== undefined) {
      directRole.responsesReceived = counts.responsesReceived;
    }
    if (counts.meetingsScheduled !== undefined) {
      directRole.meetingsScheduled = counts.meetingsScheduled;
    }
    if (counts.successfulPlacements !== undefined) {
      directRole.successfulPlacements = counts.successfulPlacements;
    }
    
    return await this.directRepository.save(directRole);
  }
}
