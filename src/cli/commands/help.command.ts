import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName() {
    return '--help';
  }

  public execute(..._parameters: string[]) {
    console.info(`
        ${chalk.green('Программа для подготовки данных для REST API сервера.')}

        ${chalk.bgGreen('Пример:')}
            ${chalk.yellowBright('cli.js --<command> [--arguments]')}
        ${chalk.bgGreen('Команды:')}
            ${chalk.yellowBright('--version:')}                   ${chalk.yellowBright('# выводит номер версии')}
            ${chalk.yellowBright('--help:')}                      ${chalk.yellowBright('# печатает этот текст')}
            ${chalk.yellowBright('--import <path>:')}             ${chalk.yellowBright('# импортирует данные из TSV')}
    `);
  }
}
