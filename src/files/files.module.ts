import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import {CloudinaryService} from "../cloudinary/cloudinary.service";
import {CloudinaryProvider} from "../cloudinary/cloudinary.provider";

@Module({
  providers: [FilesService, CloudinaryService, CloudinaryProvider],
  exports: [FilesService]
})
export class FilesModule {}
