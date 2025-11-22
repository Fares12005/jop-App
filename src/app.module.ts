import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {resolve} from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { CompanyModule } from './company/company.module';
import { JopModule } from './jop/jop.module';
import { ApplicationModule } from './application/application.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: resolve(`config/.env.dev`) , isGlobal: true}) , MongooseModule.forRoot(process.env.MONGO_URL as string , {onConnectionCreate(connection) {
    console.log('MongoDB connected');
  },}), AuthModule, UserModule, AdminModule, CompanyModule, JopModule, ApplicationModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
