// utils/logger.js
import chalk from 'chalk';

export const log = {
    info: (m) => console.log(chalk.cyan('📦'), chalk.cyanBright(m)),
    ok: (m) => console.log(chalk.green('✅'), chalk.greenBright(m)),
    warn: (m) => console.log(chalk.yellow('⚠️ '), chalk.yellowBright(m)),
    err: (m) => console.log(chalk.red('❌'), chalk.redBright(m)),
    recv: (f, m) => console.log(chalk.blue('📩 ') + chalk.white.bold(f) + chalk.gray(': ') + chalk.white(m.slice(0, 120) + (m.length > 120 ? '...' : ''))),
    ai: (f, m) => console.log(chalk.magenta('🤖 ') + chalk.magenta.bold('[' + f + ']') + chalk.gray(' » ') + chalk.cyan(m.slice(0, 100) + (m.length > 100 ? '...' : ''))),
    send: (f, m) => console.log(chalk.green('📤 ') + chalk.green.bold('[' + f + ']') + chalk.gray(' ← ') + chalk.white(m.slice(0, 100) + (m.length > 100 ? '...' : ''))),
    cmd: (f, m) => console.log(chalk.yellow('⚡ ') + chalk.yellow.bold('[' + f + ']') + chalk.gray(' → ') + chalk.white(m))
};
