import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as uuid from 'uuid'
import * as path from 'path'
import * as fs from 'fs'
import {CloudinaryService} from "../cloudinary/cloudinary.service";
import {ThrowException} from "../utils/sendException";

interface CloudinaryRes {
    uri: string
    id: string,
    resourceType: string
}

@Injectable()
export class FilesService {

    filepath: string = path.resolve(__dirname, '..', 'static')
    totalFilePath: string = ''

    constructor(private cloudinaryService: CloudinaryService) {
    }

    async createFile (file: any): Promise<CloudinaryRes> {
        try {

            if(!file){
                return {
                    uri: '',
                    id: '',
                    resourceType: ''
                }
            }

            if(file.size > 30 * 1000000){
                return ThrowException( 7000)
            }

            if(!fs.existsSync(this.filepath)){
                fs.mkdirSync(this.filepath, {recursive: true})
            }

            const type = path.extname(file?.originalname)

            const filename = `${uuid.v4()}.${type}`

            this.totalFilePath = path.join(this.filepath, filename)

            await fs.writeFile(this.totalFilePath, file.buffer, (err => {
                if(err) {
                    return ThrowException(7001,  HttpStatus.INTERNAL_SERVER_ERROR)
                }
            }))

            const response = await this.cloudinaryService.uploadImage(this.totalFilePath)

            return {
                uri: response.secure_url,
                id: response.public_id,
                resourceType: response.resource_type
            }

        }catch (e) {

            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)

        }finally {

            if(fs.existsSync(this.totalFilePath)){
                await fs.unlink(this.totalFilePath, function (){})
            }

        }
    }

    async delete (id: string, type: string) {
        return this.cloudinaryService.deleteFile(id, type)
    }


}