// features/sticker.js
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { log } from '../utils/logger.js';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const TMP = './tmp';
if (!fs.existsSync(TMP)) fs.mkdirSync(TMP);

export async function createSticker(sock, m, senderName) {
    try {
        const jid = m.key.remoteJid;

        log.cmd(senderName, 'Sticker command');

        // Detect image (direct or replied)
        const msg =
            m.message?.imageMessage
                ? m
                : m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage
                ? {
                      key: {
                          remoteJid: jid,
                          id: m.message.extendedTextMessage.contextInfo.stanzaId,
                          fromMe: false
                      },
                      message: m.message.extendedTextMessage.contextInfo.quotedMessage
                  }
                : null;

        if (!msg) {
            await sock.sendMessage(jid, {
                text: '❌ Send or REPLY to an image with `.sticker`'
            });
            return;
        }

        // Download image
        const buffer = await downloadMediaMessage(
            msg,
            'buffer',
            {},
            { logger: undefined, reuploadRequest: sock.updateMediaMessage }
        );

        if (!buffer) throw new Error('Download failed');

        const input = path.join(TMP, `img_${Date.now()}.jpg`);
        const output = path.join(TMP, `stk_${Date.now()}.webp`);

        fs.writeFileSync(input, buffer);

        // Convert image → webp sticker
        await execPromise(`
            ffmpeg -y -i "${input}" \
            -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white@0.0" \
            -vcodec libwebp -lossless 1 -loop 0 -preset default -an -vsync 0 \
            "${output}"
        `);

        const stickerBuffer = fs.readFileSync(output);

        await sock.sendMessage(jid, {
            sticker: stickerBuffer
        });

        fs.unlinkSync(input);
        fs.unlinkSync(output);

        log.ok('Sticker sent');

    } catch (err) {
        log.err(`Sticker failed: ${err.message}`);
        await sock.sendMessage(m.key.remoteJid, {
            text: '❌ Failed to create sticker'
        });
    }
}

// Command detector
export function isStickerCommand(m) {
    const text =
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        '';

    return text.toLowerCase() === '.sticker';
}

// Promise wrapper
function execPromise(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (err) => (err ? reject(err) : resolve()));
    });
}
