import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as Yup from 'yup';

@Injectable()
export class ConfigService {
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
    ConfigService.loadFromEnvFile();
    const vars = Object.assign({}, process.env) as any;
    try {
      this.registerApp(vars);
      this.registerPostgres(vars);
      this.registerMongo(vars);
      this.registerElastic(vars);
      this.registerKafka(vars);
    } catch (error: any) {
      throw new Error(`Config validation error: ${error.message}`);
    }
  }

  private static loadFromEnvFile() {
    if (process.env.ENV === 'test') {
      dotenv.config({ path: '.env.test' });
      return;
    }
    dotenv.config();
  }

  private registerApp(vars: { [varName: string]: any }) {
    const appSchema = Yup.object().shape({
      ENV: Yup.string()
        .oneOf(['development', 'test', 'production'])
        .default('production'),
      APP_PORT: Yup.number().default(3000),
      APP_CORS_ORIGIN: Yup.string().optional(),
    });
    const config = appSchema.validateSync(vars, { stripUnknown: true });
    this.app = {
      port: config.APP_PORT,
      cors: {
        origin:
          config.APP_CORS_ORIGIN === ''
            ? undefined
            : config.APP_CORS_ORIGIN?.split(','),
      },
    };
  }

  private registerPostgres(vars: { [varName: string]: any }) {
    const appSchema = Yup.object().shape({
      POSTGRES_HOST: Yup.string().required(''),
      POSTGRES_PORT: Yup.number().required(),
      POSTGRES_USER: Yup.string().required(),
      POSTGRES_SSL: Yup.boolean().required(),
      POSTGRES_PASSWORD: Yup.string().required(),
      POSTGRES_DATABASE: Yup.string().required(),
    });

    const config = appSchema.validateSync(vars, { stripUnknown: true });
    this.postgres = {
      host: config.POSTGRES_HOST,
      port: config.POSTGRES_PORT,
      user: config.POSTGRES_USER,
      ssl: config.POSTGRES_SSL,
      password: config.POSTGRES_PASSWORD,
      database: config.POSTGRES_DATABASE,
    };
  }

  private registerMongo(vars: { [varName: string]: any }) {
    const appSchema = Yup.object().shape({
      MONGO_URI: Yup.string().required(),
      MONGO_DATABASE: Yup.string().required(),
    });

    const config = appSchema.validateSync(vars, { stripUnknown: true });

    this.mongo = {
      uri: config.MONGO_URI,
      database: config.MONGO_DATABASE,
    };
  }

  private registerElastic(vars: { [varName: string]: any }) {
    const appSchema = Yup.object().shape({
      ELASTIC_NODE: Yup.string().required(),
      ELASTIC_USERNAME: Yup.string().optional(),
      ELASTIC_PASSWORD: Yup.string().optional(),
      ELASTIC_INDEX_TEST: Yup.string().required(),
    });

    const config = appSchema.validateSync(vars, { stripUnknown: true });

    this.elastic = {
      node: config.ELASTIC_NODE,
      username: config.ELASTIC_USERNAME,
      password: config.ELASTIC_PASSWORD,
      indices: {
        test: config.ELASTIC_INDEX_TEST,
      },
    };
  }

  private registerKafka(vars: { [varName: string]: any }) {
    const appSchema = Yup.object().shape({
      KAFKA_CLIENT_ID: Yup.string().required(),
      KAFKA_BROKER: Yup.string().required(),
      KAFKA_USE_SSL: Yup.boolean().required(),
      KAFKA_SSL_CA: Yup.string().optional(),
      KAFKA_USERNAME: Yup.string().optional(),
      KAFKA_PASSWORD: Yup.string().optional(),
      KAFKA_GROUPID: Yup.string().required(),
      KAFKA_TOPIC_TEST: Yup.string().required(),
    });

    const config = appSchema.validateSync(vars, { stripUnknown: true });

    this.kafka = {
      clientId: config.KAFKA_CLIENT_ID,
      brokers: config.KAFKA_BROKER.split(','),
      useSsl: config.KAFKA_USE_SSL,
      sslCa: config.KAFKA_SSL_CA,
      username: config.KAFKA_USERNAME,
      password: config.KAFKA_PASSWORD,
      groupId: config.KAFKA_GROUPID,
      topics: {
        test: config.KAFKA_TOPIC_TEST,
      },
    };
  }
}
