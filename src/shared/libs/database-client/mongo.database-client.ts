import { DatabaseClient } from './index.js';
import * as Mongoose from 'mongoose';
import { injectable, inject } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../logger/index.js';
import { setTimeout } from 'node:timers/promises';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 1000;

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isConnected: boolean;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.isConnected = false;
  }

  public isConnectedToDB() {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDB()) {
      throw new Error('MongoDB client already connected');
    }

    this.logger.info('Trying to connect to DB....');

    let attempt = 0;

    while (attempt < RETRY_COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Db connection established.');
        return;
      } catch (e) {
        attempt++;
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`, e as Error);
        await setTimeout(RETRY_TIMEOUT);
      }
    }

    throw new Error(`Unable to establish database connection after ${RETRY_COUNT}`);
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDB()) {
      throw new Error('Not connected to the database');
    }

    await this.mongoose.disconnect?.();
    this.isConnected = false;
    this.logger.info('Db connection closed.');
  }
}
