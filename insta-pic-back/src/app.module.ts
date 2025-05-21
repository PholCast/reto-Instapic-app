import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PhotoModule } from './photo/photo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Photo } from './photo/entities/photo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'supabase.com',
      port: 6543,
      username: 'postgres',
      password: 'pass',
      database: 'postgres',
      entities: [User, Photo],
      synchronize: true, // solo en desarrollo
    }),
    UserModule, 
    AuthModule, 
    PhotoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
