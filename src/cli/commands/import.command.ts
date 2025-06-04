import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { generateRentalOffer } from '../../shared/helpers/index.js';

export class ImportCommand implements Command {
  private onImportedLine(line: string) {
    const offer = generateRentalOffer(line);
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]) {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename);

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    await fileReader.read();
  }
}
