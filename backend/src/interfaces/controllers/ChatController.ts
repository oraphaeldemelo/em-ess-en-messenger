import { FastifyReply, FastifyRequest } from "fastify";


export class ChatController {

    constructor() {}

    async listConversations(request: FastifyRequest, reply: FastifyReply){
        try {

            const mockConversations = [
                {
                    id: '1', 
                    title: 'Conversa com João',
                    participants: [
                        { id: '1', username: 'João', email: 'joao@email.com', status: 'online', createdAt: new Date(), updatedAt: new Date()},
                        { id: '2', username: 'Maria', email: 'maria@email.com', status: 'online', createdAt: new Date(), updatedAt: new Date()}
                    ],
                    lastMessage: {
                        id: '1',
                        conversationId: '1',
                        senderId: '1',
                        content: 'Oi, como você está?',
                        createdAt: new Date(),
                    },
                    updatedAt: new Date(),

                },
                {
                    id: '2', 
                    title: 'Grupo de estudos',
                    participants: [
                        { id: '1', username: 'João', email: 'joao@email.com', status: 'online', createdAt: new Date(), updatedAt: new Date()},
                        { id: '3', username: 'Pedro', email: 'pedro@email.com', status: 'away', createdAt: new Date(), updatedAt: new Date()}
                    ],
                    lastMessage: {
                        id: '2',
                        conversationId: '2',
                        senderId: '3',
                        content: 'Vamos nos reunir hoje?',
                        createdAt: new Date(),
                    },
                    updatedAt: new Date(),

                }
            ]

            return reply.code(200).send(mockConversations);
            
        } catch (error) {
            return reply.code(500).send({ error: 'Internal error'})
        }
    }

    async listMessages(request: FastifyRequest<{ Params: { conversationId: string }}>, reply: FastifyReply) {
        try {
            const { conversationId } = request.params;

            const mockMessages = [
                {
                    id: '1',
                    conversationId,
                    senderId: '1',
                    content: 'Oi, como você está?',
                    createdAt: new Date('2024-01-10T10:00:00Z'),
                },
                {
                    id: '2',
                    conversationId,
                    senderId: '2',
                    content: 'Estou bemm, obrigado! E você?',
                    createdAt: new Date('2024-01-10T10:01:00Z'),
                },
                {
                    id: '3',
                    conversationId,
                    senderId: '1',
                    content: 'Estou bem também, que bom falar com você',
                    createdAt: new Date('2024-01-10T10:01:00Z'),
                }
            ]
            return reply.code(200).send(mockMessages);
        } catch (error) {
            return reply.code(500).send({ error: 'Internal error'})
        }
    }
    
    async sendMessage(request: FastifyRequest<{Params:  {conversationId: string}, Body: { content: string}}>, reply: FastifyReply) {
        try {
            const { conversationId } = request.params;
            const { content } = request.body;

            const newMessage = {
                id: Date.now().toString(),
                conversationId,
                senderid: '1',  // TODO: Pegar do token JWT
                content,
                createdAt: new Date(),
            }

            return reply.code(201).send(newMessage);
        } catch (error) {
            return reply.code(500).send({ error: 'Internal error'});
        }
    }
}