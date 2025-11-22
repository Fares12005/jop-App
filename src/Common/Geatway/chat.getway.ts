// في ChatGateway.ts

import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

interface Chat { senderId: Types.ObjectId; receiverId: Types.ObjectId; message: string[]; }
type ChatDocument = Chat & Document; 

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(@InjectModel('Chat') private chatModel: Model<ChatDocument>) {}
    
    handleConnection(client: Socket, ...args: any[]) {
    }


    @SubscribeMessage('startChat')
    async handleStartChat(client: Socket, payload: { targetUserId: string }) {
        const hrId = client.data.user.id;
        const hrRole = client.data.user.role;
        
        if (hrRole !== 'hr' && hrRole !== 'owner') {
            throw new WsException('Only HR or Owner can initiate a chat.');
        }

        const targetUserId = new Types.ObjectId(payload.targetUserId);

        let chat = await this.chatModel.findOne({
            $or: [
                { senderId: hrId, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: hrId } 
            ]
        }).exec();

        if (!chat) {
            chat = await this.chatModel.create({
                senderId: hrId,
                receiverId: targetUserId,
                message: []
            });
        }
        
        const roomId = chat._id.toString();
        client.join(roomId);

        this.server.to(payload.targetUserId).emit('chatInitiated', { roomId: roomId, hrId: hrId });
        
        return { event: 'chatStarted', roomId: roomId, chatHistory: chat.message };
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: { roomId: string; content: string }) {
        const senderId = client.data.user.id;
        
        const formattedMessage = `${senderId}::${new Date().toISOString()}::${payload.content}`;

        const updatedChat = await this.chatModel.findByIdAndUpdate(
            payload.roomId,
            { $push: { message: formattedMessage } }, 
            { new: true }
        ).exec();
        
        if (!updatedChat) {
            throw new WsException('Chat room not found.');
        }

        this.server.to(payload.roomId).emit('newMessage', { 
            senderId: senderId, 
            content: payload.content,
            rawMessage: formattedMessage 
        });
        
        return { event: 'messageSent', success: true };
    }

    @SubscribeMessage('joinChatRoom')
    handleJoinRoom(client: Socket, payload: { roomId: string }) {
        client.join(payload.roomId);
        return { event: 'roomJoined', roomId: payload.roomId };
    }
}