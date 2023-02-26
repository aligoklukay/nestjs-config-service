import { Injectable } from '@nestjs/common';
import { baseConfigZod, Env, Protocol } from './config-files/base.config';
import { mongoConfigZod } from './config-files/mongo.config';
import {
  createConfigFromEnv,
  InferConfig,
} from './helpers/create-config-from-env';

@Injectable()
export class ConfigService3 implements InferConfig<typeof baseConfigZod> {
  nodeEnv: Env;
  port: number;
  graphqlPlaygroundEnabled: boolean;
  fileUploadMaxSize: number;
  fileUploadMaxFiles: number;
  protocol: Protocol;
  host: string;
  throttleTtl: number;
  mongo: InferConfig<typeof mongoConfigZod>;
  base: InferConfig<typeof baseConfigZod>;

  constructor() {
    const env = process.env;
    this.base = createConfigFromEnv(baseConfigZod, env);
    this.mongo = createConfigFromEnv(mongoConfigZod, env);
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === Env.development;
  }

  get isProduction(): boolean {
    return this.nodeEnv === Env.production;
  }

  get isStaging(): boolean {
    return this.nodeEnv === Env.staging;
  }
}
