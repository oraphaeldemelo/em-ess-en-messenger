import Joi from 'joi';

export function validateSocketPayload<T>(
    schema: Joi.ObjectSchema<T>,
    payload: unknown
): T | null {
    const { error, value } = schema.validate(payload, { abortEarly: false, allowUnknown: false, convert: false })

    if(error) {
        console.warn('[socket] Invalid payload: ', error.details.map((detail) => detail.message));
        return null;
    }

    return value;
}