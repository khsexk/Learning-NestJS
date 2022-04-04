import {
  OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { ChatRoomService } from './chatRoom.service';
import { setInitDTO } from './dto/backEnd.dto';
  
// @WebSocketGateway(PORT) : Socket Server를 세팅
@WebSocketGateway(4000, {
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    client: Record<string, any>;
    constructor(private readonly ChatRoomService: ChatRoomService) { }
    @WebSocketServer()
    server: Server;

    // onConnect 컨트롤
    public handleConnection(client: Socket): void {
      console.log('connected', client.id);
      client.leave(client.id);
      client.data.roomId = `room:lobby`;
      client.join('room:lobby');
    }

    // onDisconnect 컨트롤
    public handleDisconnect(client: Socket): void {
      const { roomId } = client.data;
      if(roomId != 'room:lobby' && !this.server.sockets.adapter.rooms.get(roomId)){
        this.ChatRoomService.deleteChatRoom(roomId);
        this.server.emit(
          'getChatRoomList',
            this.ChatRoomService.getChatRoomList(),
        );
      }
      console.log('disconnected', client.id);
    }

    // @SubscribeMessage(이름) : event라는 유형의 message를 받게되면 onEvent 함수를 작동시킨다. return 을 통해 응답할 수 있다
    @SubscribeMessage('sendMessage')
    sendMessage(client: Socket, message: string): void {
      const { roomId } = client.data;
      client.to(roomId).emit('getMessage', {
        id: client.id,
        nickname: client.data.nickname,
        message,
      });
    }

    @SubscribeMessage('setInit')
    setInit(client: Socket, data: setInitDTO) {
      // 이미 최초 세팅이 돼있는 경우
      if(client.data.isInit){
        return;
      }
      client.data.nickname = data.nickname ? data.nickname : '낯선사람' + client.id;
      client.data.isInit = true;

      return {
        nickname: client.data.nickname,
        room: {
          roomId: 'room:lobby',
          roomName: '로비'
        },
      };
    }

    //닉네임 변경
    @SubscribeMessage('setNickname')
    setNickname(client: Socket, nickname: string): void {
      const { roomId } = client.data;
      client.to(roomId).emit('getMessage', {
          id: null,
          nickname: '안내',
          message: `"${client.data.nickname}"님이 "${nickname}"으로 닉네임을 변경하셨습니다.`,
      });
      client.data.nickname = nickname;
    }

    //채팅방 목록 가져오기
    @SubscribeMessage('getChatRoomList')
    getChatRoomList(client: Socket, payload: any) {
      client.emit('getChatRoomList', this.ChatRoomService.getChatRoomList());
    }

    //채팅방 생성하기
    @SubscribeMessage('createChatRoom')
    createChatRoom(client: Socket, roomName: string) {
      //이전 방이 만약 나 혼자있던 방이면 제거
      if (client.data.roomId != 'room:lobby' && this.server.sockets.adapter.rooms.get(client.data.roomId).size == 1) {
          this.ChatRoomService.deleteChatRoom(client.data.roomId);
      }

      this.ChatRoomService.createChatRoom(client, roomName);
      return {
        roomId: client.data.roomId,
        roomName: this.ChatRoomService.getChatRoom(client.data.roomId).roomName,
      };
    }

    //채팅방 들어가기
    @SubscribeMessage('enterChatRoom')
    enterChatRoom(client: Socket, roomId: string) {
      //이미 접속해있는 방 일 경우 재접속 차단
      if (client.rooms.has(roomId)) {
        return;
      }

      //이전 방이 만약 나 혼자있던 방이면 제거
      if (client.data.roomId != 'room:lobby' && this.server.sockets.adapter.rooms.get(client.data.roomId).size == 1) {
            this.ChatRoomService.deleteChatRoom(client.data.roomId);
      }
      
      this.ChatRoomService.enterChatRoom(client, roomId);
      
      return {
          roomId: roomId,
          roomName: this.ChatRoomService.getChatRoom(roomId).roomName,
      };
    }
}