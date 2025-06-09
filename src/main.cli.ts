import { CliApp, HelpCommand, VersionCommand, ImportCommand, GenerateCommand } from './cli/index.js';
import 'reflect-metadata';

function bootstrap() {
  const cliApp = new CliApp();

  cliApp.registerCommand([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand(),
  ]);

  cliApp.processCommand(process.argv);
}

bootstrap();
