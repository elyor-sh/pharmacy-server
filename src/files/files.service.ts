import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs'
import * as uuid from 'uuid'

@Injectable()
export class FilesService {

    filepath = path.resolve(__dirname, '..', 'static')

    async createFile (file: any): Promise<string> {
        try {

            if(!file){
                return ''
            }

            if(file.size > 20 * 1000000){
                throw new HttpException(`Fayl hajmi 20 MB dan kam bo'lishi kerak`, HttpStatus.BAD_REQUEST)
            }


            if(!fs.existsSync(this.filepath)){
                fs.mkdirSync(this.filepath, {recursive: true})
            }

            const type = file?.name?.split('.').pop() || '.jpg'

            const filename = uuid.v4() + `${type}`

            const totalFilePath = path.join(this.filepath, filename)

            await fs.writeFile(totalFilePath, file.buffer, (err => {
                if(err) {
                    throw new HttpException(`Faylni diskka yozishda muammo tug'ildi`, HttpStatus.INTERNAL_SERVER_ERROR)
                }
            }))

            return filename

        }catch (e) {

            if(file.size > 20 * 1000000){
                throw new HttpException(`Fayl hajmi 20 MB dan kam bo'lishi kerak`, HttpStatus.BAD_REQUEST)
            }

           throw new HttpException(`Faylni diskka yozishda muammo tug'ildi`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateFile (filename: string, file: any): Promise<string> {

        if(file.size > 20 * 1000000){
            throw new HttpException(`Fayl hajmi 20 MB dan kam bo'lishi kerak`, HttpStatus.BAD_REQUEST)
        }

        const totalOldFilePath = path.join(this.filepath, filename)

        if(fs.existsSync(totalOldFilePath)){
            fs.unlinkSync(totalOldFilePath);
        }

        if(!fs.existsSync(this.filepath)){
            fs.mkdirSync(this.filepath, {recursive: true})
        }

        const type = file?.name?.split('.').pop() || '.jpg'

        const newFilename = uuid.v4() + `${type}`

        const totalFilePath = path.join(this.filepath, newFilename)

        await fs.writeFile(totalFilePath, file.buffer, (err => {
            if(err) {
                throw new HttpException(`Faylni diskka yozishda muammo tug'ildi`, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }))

        return newFilename
    }

    async deleteFile (filename: string) {
        try {

            const totalFilePath = path.join(this.filepath, filename)

            if(fs.existsSync(totalFilePath)){
                fs.unlinkSync(totalFilePath);
            }

        }catch (e) {
            console.log(e)
            throw new HttpException(`Faylni diskka yozishda muammo tug'ildi`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
