import {SetMetadata} from "@nestjs/common";

export const ROLES_KEY = 'roles'

export type RolesType = 'admin' | 'user' | 'manager'

export const Roles = (...roles: RolesType[]) => SetMetadata(ROLES_KEY, roles)