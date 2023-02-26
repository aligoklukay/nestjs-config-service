import 'dotenv/config';
import { z } from 'zod';
import { stringifiedIntegerZod } from '../helpers/conversion';

export enum Env {
  staging = 'staging',
  development = 'development',
  production = 'production',
}

const PROTOCOLS = ['http', 'https'] as const;
export type Protocol = (typeof PROTOCOLS)[number];

export const baseConfigZod = {
  nodeEnv: ['NODE_ENV', z.nativeEnum(Env).default(Env.development)],
  port: ['PORT', stringifiedIntegerZod(3000)],
  protocol: ['PROTOCOL', z.enum(PROTOCOLS).default('http')],
  host: ['HOST', z.string().default('localhost')],
} as const;
