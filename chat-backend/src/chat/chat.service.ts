import { Injectable } from '@nestjs/common';
import { OpenAI } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is not defined');
    }
    this.openai = new OpenAI({
      openAIApiKey: apiKey,
      streaming: true,
    });
  }

  async processMessage(content: string): Promise<string> {
    try {
      const response = await this.openai.call(content);
      return response;
    } catch (error) {
      console.error('Error processing message:', error.message);
      throw new Error('Error processing message: ' + error.message);
    }
  }
}
