import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ImagesController } from './images.controller';
import { path } from 'app-root-path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
  ],
  providers: [ImagesService],
  controllers: [ImagesController],
})
export class ImagesModule {}
