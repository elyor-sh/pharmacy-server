import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./users.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {BaseGetQuery} from "../utils/types";
import {paginationQuery} from "../utils/pagination";
import {normalizeResponse} from "../utils/response-util";

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService
    ) {}


    async createUser(dto: CreateUserDto){
        const user = await this.userRepository.create(dto)
        const role = await this.rolesService.getRoleByValue('user')
        await  user.$set('roles', role?.id ?role?.id  : null)
        user.roles = role
        return normalizeResponse<typeof user>(user, null)
    }

    async getAllUsers(query: BaseGetQuery) {

        const {page, rowCount, options} = paginationQuery(query.rowsPerPage, query.page)

        const users = await this.userRepository.findAll({include: {all: true}})
        const usersWithLimit = await this.userRepository.findAll(
            {
                include: {all: true},
                ...options
            },
        )
        const response = this.deleteUsersPass(usersWithLimit)

        return normalizeResponse<typeof response>(
            response,
            {
                page,
                rowCount,
                totalPage: users.length
            }
        )
    }

    public async getUserByEmail (email: string){
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        return user
    }

    async addRoleToUsers (dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId)
        const role = await this.rolesService.getRoleByValue(dto.value)
        if(role && user){
            await user.$add('role', role.id)
            return dto
        }

        throw  new  HttpException('User or role are not found', HttpStatus.NOT_FOUND)
    }

    private deleteUsersPass(users: User[]){
        return users.map(user => {
            const newUser = JSON.parse(JSON.stringify(user))
            delete newUser.password
            return newUser
        })
    }

}
