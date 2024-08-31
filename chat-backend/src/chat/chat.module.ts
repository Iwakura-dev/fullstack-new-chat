import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';

@Module({
  imports: [ConfigModule],
  providers: [ChatService, ChatResolver],
})
export class ChatModule { }
