import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';

@Injectable()
export class ConfigService2 {
  app: {
    port: number;
    cors: {
      origin?: string[];
    };
  };

  postgres: {
    host: string;
    port: number;
    user: string;
    ssl: boolean;
    password: string;
    database: string;
  };

  mongo: {
    uri: string;
    database: string;
  };

  elastic: {
    node: string;
    username: string;
    password: string;
    indices: {
      test: string;
    };
  };

  kafka: {
    clientId: string;
    brokers: string[];
    useSsl: boolean;
    sslCa: string | undefined;
    username: string;
    password: string;
    groupId: string;
    topics: {
      test: string;
    };
  };

  constructor() {
    ConfigService2.loadFromEnvFile();
    const envConfig = ConfigService2.validateInput();
    this.setAllValues(envConfig);
  }

  private static loadFromEnvFile() {
    if (process.env.ENV === 'test') {
      dotenv.config({ path: '.env.test' });
      return;
    }
    dotenv.config();
  }

  private static validateInput(): Joi.ObjectSchema {
    const envVarsSchema = Joi.object({
      ENV: Joi.string()
        .valid('development', 'test', 'production')
        .default('production'),
      APP_PORT: Joi.number().port().default(3000),
      APP_CORS_ORIGIN: Joi.string().allow('').optional(),
      MONGO_URI: Joi.string().required(),
      MONGO_DATABASE: Joi.string().required(),
      MIRTH_URL: Joi.string().uri().required(),
      ELASTIC_NODE: Joi.string().required(),
      ELASTIC_USERNAME: Joi.string().allow('').optional(),
      ELASTIC_PASSWORD: Joi.string().allow('').optional(),
      ELASTIC_INDEX_TEST: Joi.string().required(),
      KAFKA_CLIENT_ID: Joi.string().required(),
      KAFKA_BROKER: Joi.string().required(),
      KAFKA_USE_SSL: Joi.boolean().required(),
      KAFKA_SSL_CA: Joi.string().allow('').optional(),
      KAFKA_USERNAME: Joi.string().allow('').required(),
      KAFKA_PASSWORD: Joi.string().allow('').required(),
      KAFKA_GROUPID: Joi.string().required(),
      KAFKA_TOPIC_TEST: Joi.string().required(),
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_SSL: Joi.boolean().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DATABASE: Joi.string().required(),
    });

    const vars = Object.assign({}, process.env) as any;
    const { error, value: validatedEnvConfig } = envVarsSchema.validate(vars, {
      stripUnknown: true,
    });
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  private setAllValues(envConfig: { [varName: string]: any }) {
    this.app = {
      port: envConfig.APP_PORT,
      cors: {
        origin:
          envConfig.APP_CORS_ORIGIN === ''
            ? undefined
            : envConfig.APP_CORS_ORIGIN?.split(','),
      },
    };
    this.postgres = {
      host: envConfig.POSTGRES_HOST,
      port: envConfig.POSTGRES_PORT,
      user: envConfig.POSTGRES_USER,
      ssl: envConfig.POSTGRES_SSL,
      password: envConfig.POSTGRES_PASSWORD,
      database: envConfig.POSTGRES_DATABASE,
    };
    this.mongo = {
      uri: envConfig.MONGO_URI,
      database: envConfig.MONGO_DATABASE,
    };
    this.elastic = {
      node: envConfig.ELASTIC_NODE.split(','),
      username: envConfig.ELASTIC_USERNAME,
      password: envConfig.ELASTIC_PASSWORD,
      indices: {
        test: envConfig.ELASTIC_INDEX_TEST,
      },
    };
    this.kafka = {
      clientId: envConfig.KAFKA_CLIENT_ID,
      brokers: envConfig.KAFKA_BROKER.split(','),
      useSsl: envConfig.KAFKA_USE_SSL,
      sslCa: envConfig.KAFKA_SSL_CA,
      username: envConfig.KAFKA_USERNAME,
      password: envConfig.KAFKA_PASSWORD,
      groupId: envConfig.KAFKA_GROUPID,
      topics: {
        test: envConfig.KAFKA_TOPIC_TEST,
      },
    };
  }
}
