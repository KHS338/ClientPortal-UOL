// backend/src/roles/role.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      // Validate service tag
      const validServiceTags = [1000, 2000, 3000, 4000];
      if (!validServiceTags.includes(createRoleDto.serviceTag)) {
        throw new BadRequestException('Invalid service tag. Must be 1000, 2000, 3000, or 4000');
      }

      // Validate client number range based on service tag
      const isValidRange = this.validateClientNoRange(createRoleDto.clientNo, createRoleDto.serviceTag);
      if (!isValidRange) {
        throw new BadRequestException('Client number is out of range for the specified service tag');
      }

      // Note: We allow multiple roles with the same client number and service tag
      // since a client can have multiple roles within the same service type
      // but they should maintain the same client number

      const role = this.roleRepository.create(createRoleDto);
      return await this.roleRepository.save(role);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create role');
    }
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { isDeleted: false },
      relations: ['client', 'cvSourcingRole'],
      order: { createdAt: 'DESC' }
    });
  }

  async findAllIncludingDeleted(): Promise<Role[]> {
    return await this.roleRepository.find({
      relations: ['client', 'cvSourcingRole'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByServiceTag(serviceTag: number): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { serviceTag, isDeleted: false },
      relations: ['client', 'cvSourcingRole'],
      order: { clientNo: 'ASC' }
    });
  }

  async findByClientId(clientId: number): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { clientId, isDeleted: false },
      relations: ['client', 'cvSourcingRole'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['client', 'cvSourcingRole']
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // If updating client number or service tag, validate the combination
    if (updateRoleDto.clientNo !== undefined || updateRoleDto.serviceTag !== undefined) {
      const newClientNo = updateRoleDto.clientNo ?? role.clientNo;
      const newServiceTag = updateRoleDto.serviceTag ?? role.serviceTag;

      const isValidRange = this.validateClientNoRange(newClientNo, newServiceTag);
      if (!isValidRange) {
        throw new BadRequestException('Client number is out of range for the specified service tag');
      }

      // Note: We don't check for duplicate client numbers since clients can have 
      // multiple roles within the same service type with the same client number
    }

    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  async softDelete(id: number): Promise<void> {
    const role = await this.findOne(id);
    role.isDeleted = true;
    await this.roleRepository.save(role);
  }

  async hardDelete(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }

  async getNextAvailableClientNo(serviceTag: number): Promise<number> {
    const range = this.getClientNoRange(serviceTag);
    if (!range) {
      throw new BadRequestException('Invalid service tag');
    }

    // Find all unique client numbers for this service tag (distinct by clientNo)
    const existingRoles = await this.roleRepository
      .createQueryBuilder('role')
      .select('DISTINCT role.clientNo', 'clientNo')
      .where('role.serviceTag = :serviceTag', { serviceTag })
      .andWhere('role.isDeleted = :isDeleted', { isDeleted: false })
      .getRawMany();

    const existingNumbers = existingRoles.map(role => parseInt(role.clientNo));

    // Find the first available number in the range
    for (let i = range.min; i <= range.max; i++) {
      if (!existingNumbers.includes(i)) {
        return i;
      }
    }

    throw new BadRequestException('No available client numbers for this service tag');
  }

  async getClientNoForClientAndService(clientId: number, serviceTag: number): Promise<number | null> {
    const existingRole = await this.roleRepository.findOne({
      where: { 
        clientId, 
        serviceTag, 
        isDeleted: false 
      },
      select: ['clientNo']
    });

    return existingRole ? existingRole.clientNo : null;
  }

  private validateClientNoRange(clientNo: number, serviceTag: number): boolean {
    const range = this.getClientNoRange(serviceTag);
    if (!range) return false;
    
    return clientNo >= range.min && clientNo <= range.max;
  }

  private getClientNoRange(serviceTag: number): { min: number; max: number } | null {
    switch (serviceTag) {
      case 1000: // CV Sourcing
        return { min: 0, max: 1000 };
      case 2000: // Pre-qualification
        return { min: 1001, max: 2000 };
      case 3000: // 360 Direct
        return { min: 2001, max: 3000 };
      case 4000: // Lead Generation
        return { min: 3001, max: 4000 };
      default:
        return null;
    }
  }
}
