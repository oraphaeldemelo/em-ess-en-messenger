import Joi from 'joi';

export const joinRoomSchema = Joi.object({
    roomId: Joi.string().required()
})

export const leaveRoomSchema = Joi.object({
    roomId: Joi.string().required()
})

const socketMessageSchema = Joi.object({
    id: Joi.string().required(),
    conversationId: Joi.string().required(),
    senderId: Joi.string().required(),
    content: Joi.string().max(4096).required(),
    createdAt: Joi.string().isoDate().required(),
})

export const sendMessageSchema = Joi.object({
    roomId: Joi.string().required(),
    message: socketMessageSchema.required(),
})