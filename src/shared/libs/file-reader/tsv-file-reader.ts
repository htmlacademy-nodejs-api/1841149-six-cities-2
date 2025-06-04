import { FileReader } from './file-reader.interface.js';
import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';
import { getErrorMessage } from '../../helpers/index.js';

const CHUNK_SIZE = 16384;

export class TSVFileReader extends EventEmitter implements FileReader {
  private readonly filename: string;

  constructor(filename: string) {
    super();
    try {
      this.filename = filename.trim();
    } catch (e) {
      console.log(getErrorMessage(e));
    }
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      encoding: 'utf-8',
      highWaterMark: CHUNK_SIZE,
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    try {
      for await (const chunk of readStream) {
        remainingData += chunk.toString();

        while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
          const completeRow = remainingData.slice(0, nextLinePosition + 1);
          remainingData = remainingData.slice(++nextLinePosition);
          importedRowCount++;

          this.emit('line', completeRow);
        }
      }
    } catch (e) {
      console.log(getErrorMessage(e));
    }

    this.emit('end', importedRowCount);
  }
}
