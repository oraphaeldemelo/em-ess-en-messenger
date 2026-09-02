import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

type NodeEnvironment =
  | 'development'
  | 'test'
  | 'production';

type DatabaseType =
  | 'sqlite'
  | 'mongodb'
  | 'postgres';

interface EnvironmentVariables {
  PORT: number;
  NODE_ENV: NodeEnvironment;

  DATABASE_TYPE: DatabaseType;
  MONGODB_URI: string;
  //POSTGRES_URI: string;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  CORS_ORIGIN: string;
  SOCKET_CORS_ORIGIN: string;
}

const envSchema = Joi.object<EnvironmentVariables>({
  PORT: Joi.number().port().default(3000),
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  DATABASE_TYPE: Joi.string().valid('sqlite', 'mongodb', 'postgres').default('sqlite'),
  MONGODB_URI: Joi.string().default('mongodb://localhost:27017/em-ess-en-messenger'),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('24h'),
  CORS_ORIGIN: Joi.string().uri().default('http://localhost:5173'),
  SOCKET_CORS_ORIGIN: Joi.string().uri().default('http://localhost:5173')
}).unknown(true)

const { value: env, error } = envSchema.validate(process.env, {
  abortEarly: false,
  convert: true,
});

if (error) {
  throw new Error(
    `Invalid environment configuration: ${error.message}`,
  );
}

export const config = {
  server: {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
  },
  database: {
    type: env.DATABASE_TYPE,
    uri: env.MONGODB_URI,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  cors: {
    origin: env.CORS_ORIGIN,
  },
  socket: {
    corsOrigin: env.SOCKET_CORS_ORIGIN,
  }
} as const;