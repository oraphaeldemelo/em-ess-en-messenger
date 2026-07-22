export interface IMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Message implements IMessage {
  constructor(
    public id: string,
    public content: string,
    public senderId: string,
    public receiverId: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  isValid(): boolean {
    return !!(this.content && this.senderId && this.receiverId);
  }

  update(content: string): void {
    this.content = content;
    this.updatedAt = new Date();
  }
}