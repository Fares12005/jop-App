import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Types } from 'mongoose';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

@Get('history/:otherUserId')
    async getChatHistory(
        @Param('otherUserId') otherUserId: Types.ObjectId,
        @Req() req: any
    ) {
        const currentUserId = new Types.ObjectId(req.user.id);
        
        const chat = await this.chatService.getConversationByParticipants(currentUserId, otherUserId);

        if (!chat) {
            throw new NotFoundException('No active chat history found with this user.');
        }

        return chat.message; 
    }


  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
