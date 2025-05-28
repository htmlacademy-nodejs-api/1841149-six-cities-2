import { CliApp, HelpCommand, VersionCommand, ImportCommand } from './cli/index.js';

function bootstrap() {
  const cliApp = new CliApp();

  cliApp.registerCommand([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand()
  ]);

  cliApp.processCommand(process.argv);
}

bootstrap();
