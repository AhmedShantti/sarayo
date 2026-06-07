import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route to one or more roles. Use together with RolesGuard.
 * Example: @Roles('ADMIN')
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
