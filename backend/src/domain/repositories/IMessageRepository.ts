import { Message } from '../entities/Message';

export interface IMessageRepository {
  create(message: Message): Promise<Message>;
  findById(id: string): Promise<Message | null>;
  findBySenderId(senderId: string): Promise<Message[]>;
  findByReceiverId(receiverId: string): Promise<Message[]>;
  findConversation(userId1: string, userId2: string): Promise<Message[]>;
  update(id: string, message: Partial<Message>): Promise<Message | null>;
  delete(id: string): Promise<boolean>;
}