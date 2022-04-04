import { Module } from '@nestjs/common';
import { ChatFrontEndController } from './rendering.controller';

@Module({
    controllers: [ChatFrontEndController],
})
export class RenderingModule {}