
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*', 
    },
})
export class SocketGateway {
    @WebSocketServer() 
    server: Server; 

    public sendApplicationNotification(hrId: string, payload: any) {
        
        this.server.to(hrId).emit('newApplication', payload);
        
        console.log(`Notification sent to HR/Owner ID: ${hrId}`);
    }
}