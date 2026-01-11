// config.js
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const CONFIG = {
    BOT_NAME: 'wbot',
    SESSION_DIR: path.join(__dirname, 'auth'),
    CONTACTS_FILE: path.join(__dirname, 'contacts.json'),
    MAX_MSG_LEN: 4000,
    PREFIX: '@wbot',
    COMMAND_PREFIX: '!'
};

export default CONFIG;
