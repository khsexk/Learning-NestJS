import { Module } from '@nestjs/common';
import { ChatModule } from './back-end/chat.module';
import { RenderingModule } from './front-end/rendering.module';


@Module({
  imports: [ChatModule, RenderingModule],

})
export class AppModule {}
