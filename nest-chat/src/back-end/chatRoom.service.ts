import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { chatRoomListDTO } from "./dto/backEnd.dto";
import { uuid } from 'uuidv4'

// client.rooms.clear() : 모든 room을 제거해줌 (오직 하나의 방에만 참여할 수 있게)

@Injectable()
export class ChatRoomService {
    private chatRoomList: Record<string, chatRoomListDTO>;
    
    constructor() {
        this.chatRoomList = {
            'room:lobby': {
                roomId: 'room:lobby',
                roomName: '로비',
                cheifId: null,
            },
        };
    }

    createChatRoom(client: Socket, roomName: string): void {
        const roomId = `room:${uuid()}`;
        const nickname: string = client.data.nickname;
        this.chatRoomList[roomId] = {
            roomId,
            cheifId: client.id,
            roomName,
        };

        client.data.roomId = roomId;
        client.rooms.clear();
        client.join(roomId);
        client.emit('getMessage', {
            id: null,
            nickname: '안내',
            message: '"' + nickname + '"님이"' + roomName + '"방을 생성하였습니다"',
        });
    }

    enterChatRoom(client: Socket, roomId: string) {
        client.data.roomId = roomId;
        client.rooms.clear();
        client.join(roomId);

        const { nickname } = client.data;
        const { roomName } = this.getChatRoom(roomId);

        client.to(roomId).emit('getMessage', {
            id: null,
            nickname: '안내',
            message: `"${nickname}"님이 "${roomName}"방에 접속하셨습니다.`,
        });
    }

    exitChatRoom(client: Socket, roomId: string){
        client.data.roomId = `room:lobby`;
        client.rooms.clear();
        client.join(`room:lobby`);

        const { nickname } = client.data;
        client.to(roomId).emit('getMessage', {
            id: null,
            nickname: '안내',
            message: '"' + nickname + '"님이 방을 나갔습니다.',
        });
    }

    getChatRoom(roomId: string): chatRoomListDTO{
        return this.chatRoomList[roomId];
    }

    getChatRoomList(): Record<string, chatRoomListDTO>{
        return this.chatRoomList;
    }

    deleteChatRoom(roomId: string): void{
        delete this.chatRoomList[roomId];
    }
}