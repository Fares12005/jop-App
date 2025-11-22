import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat } from 'src/DB/models/Chat.model';

@Injectable()
export class ChatService {

  constructor(
   @InjectModel('Chat') private readonly chatModel: Model<Chat>,
  ) {}



  async getConversationByParticipants(userId1: Types.ObjectId, userId2: Types.ObjectId) {
        const chat = await this.chatModel.findOne({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        }).exec();

        return chat;
    }

    async createNewChat(hrId: Types.ObjectId, userId: Types.ObjectId): Promise<Chat> {
        
        const existingChat = await this.getConversationByParticipants(hrId, userId);
        if (existingChat) {
            return existingChat;
        }
        const newChat = await this.chatModel.create({
            senderId: hrId,
            receiverId: userId,
            message: []
        });

        return newChat;
    }
    
    async saveMessageToChat(roomId: Types.ObjectId, formattedMessage: string): Promise<void> {
        
        await this.chatModel.findByIdAndUpdate(
            roomId,
            { $push: { message: formattedMessage } },
        ).exec();
    }


  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
