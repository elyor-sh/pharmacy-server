import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs'
import * as uuid from 'uuid'

@Injectable()
export class FilesService {

    async createFile (file: any): Promise<string> {
        try {

            const filepath = path.resolve(__dirname, '..', 'static')

            if(!fs.existsSync(filepath)){
                fs.mkdirSync(filepath, {recursive: true})
            }

            console.log(file.mimetype)

            const type = file?.name?.split('.').pop() || '.jpg'

            const filename = uuid.v4() + `${type}`

            const totalFilePath = path.join(filepath, filename)

            await fs.writeFile(totalFilePath, file.buffer, (err => {
                if(err) {
                    throw new HttpException(`Faylni diskka yozishda muammo tug'ildi`, HttpStatus.INTERNAL_SERVER_ERROR)
                }
            }))

            return filename

        }catch (e) {
           throw new HttpException(`Faylni diskka yozishda muammo tug'ildi`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
