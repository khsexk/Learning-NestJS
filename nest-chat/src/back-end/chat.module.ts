import { Module } from "@nestjs/common";
import { EventsGateway } from "./chat.gateway";
import { ChatRoomService } from "./chatRoom.service";

@Module({
    providers: [EventsGateway, ChatRoomService],
})
export class ChatModule {}