import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {JwtAuthGuard} from "./auth/jwt-auth.guard";
import {ValidationPipe} from "./pipes/validation.pipe";
import {JwtService} from "@nestjs/jwt";

function name () {
  var childProcess = require("child_process");
  var oldSpawn = childProcess.spawn;
  function mySpawn() {
    console.log('spawn called');
    console.log(arguments);
    var result = oldSpawn.apply(this, arguments);
    return result;
  }
  childProcess.spawn = mySpawn;
};

name()

const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule,  { cors: true });

    const config = new DocumentBuilder()
        .setTitle('Pharmacy')
        .setDescription(`Documentation for REST API`)
        .setVersion('1.0.0')
        .addTag('Pharmacy api')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('/api/docs', app, document)

    const reflector = app.get(Reflector);

 //   app.useGlobalGuards(new JwtAuthGuard(new JwtService({}), reflector))
  //  app.useGlobalPipes(new ValidationPipe())

    await app.listen(PORT, () => {
      console.log(`Server has been started in port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
