import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatModel } from 'src/DB/models/Chat.model';

@Module({
  imports:[ChatModel],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
