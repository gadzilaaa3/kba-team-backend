import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('KBA Team API')
    .setDescription('Here you can see all endpoints of our api')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addTag('Projects')
    .addTag('Media')
    .addTag('Me')
    .addTag('Admin')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
