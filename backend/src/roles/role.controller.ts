// backend/src/roles/role.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      const role = await this.roleService.create(createRoleDto);
      return {
        success: true,
        message: 'Role created successfully',
        data: role
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get()
  async findAll(@Query('serviceTag') serviceTag?: string, @Query('clientId') clientId?: string) {
    try {
      let roles;
      
      if (serviceTag) {
        roles = await this.roleService.findByServiceTag(parseInt(serviceTag));
      } else if (clientId) {
        roles = await this.roleService.findByClientId(parseInt(clientId));
      } else {
        roles = await this.roleService.findAll();
      }

      return {
        success: true,
        message: 'Roles retrieved successfully',
        data: roles
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get('cv-sourcing')
  async getCvSourcingRoles() {
    try {
      const roles = await this.roleService.findByServiceTag(1000);
      return {
        success: true,
        message: 'CV sourcing roles retrieved successfully',
        data: roles
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get('client/:clientId/service/:serviceTag/client-no')
  async getClientNoForService(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Param('serviceTag', ParseIntPipe) serviceTag: number
  ) {
    try {
      const clientNo = await this.roleService.getClientNoForClientAndService(clientId, serviceTag);
      return {
        success: true,
        message: clientNo ? 'Client number found' : 'No client number assigned for this service',
        data: { clientNo }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get('next-client-no/:serviceTag')
  async getNextAvailableClientNo(@Param('serviceTag', ParseIntPipe) serviceTag: number) {
    try {
      const nextClientNo = await this.roleService.getNextAvailableClientNo(serviceTag);
      return {
        success: true,
        message: 'Next available client number retrieved successfully',
        data: { nextClientNo }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const role = await this.roleService.findOne(id);
      return {
        success: true,
        message: 'Role retrieved successfully',
        data: role
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.roleService.update(id, updateRoleDto);
      return {
        success: true,
        message: 'Role updated successfully',
        data: role
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Query('hard') hard?: string) {
    try {
      if (hard === 'true') {
        await this.roleService.hardDelete(id);
      } else {
        await this.roleService.softDelete(id);
      }
      
      return {
        success: true,
        message: `Role ${hard === 'true' ? 'permanently deleted' : 'deleted'} successfully`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
