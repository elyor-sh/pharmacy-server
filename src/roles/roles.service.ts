import { Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import {CreateRoleDto} from "./dto/create-role.dto";
import {ThrowException} from "../utils/sendException";
import {normalizeResponse} from "../utils/response-util";

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async createRole (dto: CreateRoleDto) {
        const isExistRole = await this.roleRepository.findOne({where: {value: dto.value}})
        if(isExistRole){
            return ThrowException(9002)
        }
        const role = await this.roleRepository.create(dto)
        return normalizeResponse<typeof role>(role, null)
    }

    async deleteRole (value: string) {
        const role = await this.roleRepository.destroy({where: {value}})
        return normalizeResponse<typeof role>(role, null)
    }

    async getAllRoles () {
        const roles = await this.roleRepository.findAll()
        return normalizeResponse<typeof roles>(roles, null)
    }

    public async getRoleByValue (value: string) {
        const role = await this.roleRepository.findOne({where: {value}})
        return role
    }

}
