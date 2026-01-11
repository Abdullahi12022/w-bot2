// handlers/messageHandler.js
import { log } from '../utils/logger.js';
import { tagAllMembers } from '../features/tagAll.js';
import { createSticker, isStickerCommand } from '../features/sticker.js';
import { aiReply } from '../features/ai.js';
import { handleViewOnce, isViewOnceCommand } from '../features/viewOnce.js';
import { tagWithMessage, isTagMessageCommand } from '../features/tagMessage.js';
import { downloadMedia, isDownloadCommand } from '../features/mediaDownloader.js';
import CONFIG from '../config.js';

export async function handleMessage(sock, m) {
    if (!m.message || m.key.fromMe) return;

    const jid = m.key.remoteJid;
    if (jid.endsWith('@newsletter') || jid.includes('@broadcast') || jid === 'status@broadcast') {
        return;
    }

    const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const name = m.pushName || 'Unknown';

    log.recv(name, text || '[Media message]');

    // Check for sticker command
    if (isStickerCommand(m)) {
        await createSticker(sock, m, name);
        return;
    }

    // Check for view once command
    if (isViewOnceCommand(m)) {
        await handleViewOnce(sock, m, name);
        return;
    }

    // Check for media download
    if (isDownloadCommand(m)) {
        const media = await downloadMedia(sock, m, name);
        if (media) {
            await sock.sendMessage(jid, {
                text: `✅ Media downloaded!\n📁 Name: ${media.filename}\n📊 Size: ${Math.round(media.buffer.length / 1024)}KB`
            });
        }
        return;
    }

    // Check for tag message command
    if (isTagMessageCommand(m)) {
        await tagWithMessage(sock, jid, text, name);
        return;
    }

    // Check for tagall command
    if (text.toLowerCase() === '!tagall' || text.toLowerCase() === '@wbot tagall') {
        await tagAllMembers(sock, jid, name);
        return;
    }

    // Check for help command
    if (text.toLowerCase() === '!help' || text.toLowerCase() === '@wbot help') {
        await showHelp(sock, jid);
        return;
    }

    // Check for AI mention
    const isMention = text.toLowerCase().startsWith(CONFIG.PREFIX);
    if (isMention) {
        const prompt = text.replace(new RegExp(`^${CONFIG.PREFIX}`, 'i'), '').trim();
        if (!prompt) {
            await sock.sendMessage(jid, { 
                text: `👋 Hello ${name}!\n\n` +
                      `*Commands:*\n` +
                      `${CONFIG.PREFIX} [message] - Chat with AI\n` +
                      `!tagall - Tag everyone in group\n` +
                      `!sticker - Make sticker from image\n` +
                      `.vv - Extract view once image\n` +
                      `.dl - Download any media\n` +
                      `.tag [message] - Tag all with message\n` +
                      `!help - Show all commands`
            });
            return;
        }
        
        log.ai(name, prompt);
        const reply = await aiReply(prompt, name);
        await sock.sendMessage(jid, { text: reply });
    }
}

async function showHelp(sock, jid) {
    const helpText = `🤖 *W-BOT COMMANDS*

*AI Features:*
@wbot [message] - Chat with AI

*Media Tools:*
!sticker - Convert image to sticker
.dl - Download any media
.vv - Extract view once image

*Group Features:*
!tagall - Tag all members (groups)
.tag [message] - Tag all with custom message

*Utility:*
!help - Show this menu
!status - Bot status

*Examples:*
@wbot Hello there!
.tag Meeting at 3 PM! 🕒
.vv (reply to view once image)
.dl (reply to any media)

📱 *How to use:*
1. For AI: @wbot Hello
2. For view once: Reply .vv to image
3. For tagging: .tag Your message here

Created by AVDALLAH 🚀`;

    await sock.sendMessage(jid, { text: helpText });
}
