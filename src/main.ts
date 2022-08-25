import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {JwtAuthGuard} from "./auth/jwt-auth.guard";
import {ValidationPipe} from "./pipes/validation.pipe";
import {JwtService} from "@nestjs/jwt";
import {TransformInterceptor} from "./interceptors/transform.interceptor";
import {HttpExceptionFilter} from "./interceptors/exception.filter";


const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule,  { cors: true });

    app.setGlobalPrefix('/api')

    const config = new DocumentBuilder()
        .setTitle('Pharmacy')
        .setDescription(`Documentation for REST API`)
        .setVersion('1.0.0')
        .addTag('Pharmacy api')
        .addBearerAuth()
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('/api/docs', app, document)

    const reflector = app.get(Reflector);

      app.useGlobalInterceptors(new TransformInterceptor())
      app.useGlobalFilters(new HttpExceptionFilter())
      app.useGlobalGuards(new JwtAuthGuard(new JwtService({}), reflector))
      app.useGlobalPipes(new ValidationPipe())

    await app.listen(PORT, () => {
      console.log(`Server has been started in port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
