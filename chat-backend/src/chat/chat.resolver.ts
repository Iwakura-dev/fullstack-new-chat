import { Resolver, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ChatService } from './chat.service';
import { MessageInput } from './dto/message.input';
import { Message } from './models/message.models';

const pubSub = new PubSub();

@Resolver()
export class ChatResolver {
  constructor(private chatService: ChatService) { }

  @Mutation(() => Boolean)
  async sendMessage(@Args('messageInput') messageInput: MessageInput): Promise<boolean> {
    const response = await this.chatService.processMessage(messageInput.content);
    pubSub.publish('messageReceived', { messageReceived: { content: response } });
    return true;
  }

  @Subscription(() => Message, {
    resolve: (payload) => payload.messageReceived,
  })
  messageReceived() {
    return pubSub.asyncIterator('messageReceived');
  }
}
