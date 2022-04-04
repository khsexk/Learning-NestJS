import {
  OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
  
// @WebSocketGateway(PORT) : Socket Server를 세팅
@WebSocketGateway(5000)
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    client: Record<string, any>;
    constructor() {
        this.client = {};
    }
    @WebSocketServer()
    server: Server;

    // onConnect 컨트롤
    public handleConnection(client): void {
        console.log('hi');
        client['id'] = String(Number(new Date()));
        client['nickname'] = '낯선남자' + String(Number(new Date()));
        this.client[client['id']] = client;
    }

    // onDisconnect 컨트롤
    public handleDisconnect(client): void {
        console.log('bye', client['id']);
        delete this.client[client['id']];
    }
    // @SubscribeMessage(이름) : event라는 유형의 message를 받게되면 onEvent 함수를 작동시킨다. return 을 통해 응답할 수 있다
    @SubscribeMessage('sendMessage')
    sendMessage(client: Socket, message: string): void {
        this.server.emit('getMessage', message);
    }
}