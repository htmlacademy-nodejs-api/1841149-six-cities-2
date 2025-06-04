import { FileWriter } from './index.js';
import { WriteStream, createWriteStream } from 'node:fs';
import { getErrorMessage } from '../../helpers/index.js';

export class TSVFileWriter implements FileWriter {
  private stream: WriteStream;

  constructor(filename: string) {
    try {
      this.stream = createWriteStream(filename, {
        flags: 'w',
        encoding: 'utf-8',
        autoClose: true,
      });
    } catch (e) {
      console.log(getErrorMessage(e));
      console.log(e);
    }
  }

  public async write(row: string): Promise<unknown> {
    const isWriteSuccess = this.stream.write(`${row}\n`);

    if(!isWriteSuccess) {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve(true));
      });
    }

    return Promise.resolve();
  }
}
