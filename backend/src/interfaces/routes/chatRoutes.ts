import { FastifyInstance } from 'fastify';
import { ChatController } from '../controllers/ChatController';

const chatController = new ChatController();

export async function chatRoutes(fastify: FastifyInstance) {
    // GET /api/chats - Lista todas as conversas
    fastify.get('/chats', chatController.listConversations);

    // GET /api/chats/:conversationId/messages - Lista mensagens de uma conversa
    fastify.get('/chats/:conversationId/messages', chatController.listMessages);

    // POST /api/chats/:conversationId/messages - Envia uma mensagem
    fastify.post('/chats/:conversationId/messages', chatController.sendMessage);
}
