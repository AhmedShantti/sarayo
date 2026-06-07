import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get own profile' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update own profile' })
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Get('addresses')
  @ApiOperation({ summary: 'List own addresses' })
  listAddresses(@CurrentUser('id') userId: string) {
    return this.usersService.listAddresses(userId);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Add an address' })
  addAddress(@CurrentUser('id') userId: string, @Body() dto: CreateAddressDto) {
    return this.usersService.addAddress(userId, dto);
  }

  @Patch('addresses/:id')
  @ApiOperation({ summary: 'Update an address' })
  updateAddress(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.usersService.updateAddress(userId, id, dto);
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Delete an address' })
  deleteAddress(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.usersService.deleteAddress(userId, id);
  }

  @Patch('addresses/:id/default')
  @ApiOperation({ summary: 'Set an address as default' })
  setDefault(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.usersService.setDefaultAddress(userId, id);
  }
}

@ApiTags('Admin · Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users (paginated, filterable)' })
  list(@Query() query: QueryUsersDto) {
    return this.usersService.adminListUsers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  get(@Param('id') id: string) {
    return this.usersService.adminGetUser(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user (role, active status)' })
  update(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.usersService.adminUpdateUser(id, dto);
  }
}
