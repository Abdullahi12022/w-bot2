// features/viewOnce.js
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

export async function handleViewOnce(sock, m, senderName) {
    try {
        const jid = m.key.remoteJid;
        const extendedText = m.message?.extendedTextMessage;

        if (!extendedText?.contextInfo?.quotedMessage) {
            return sock.sendMessage(jid, {
                text: '❌ Reply to a *view once image or video* and type `.vv`'
            });
        }

        const quoted = extendedText.contextInfo.quotedMessage;

        // Extract actual media message safely
        const mediaMsg =
    // ViewOnce wrappers
    quoted.viewOnceMessage?.message?.imageMessage ||
    quoted.viewOnceMessage?.message?.videoMessage ||
    quoted.viewOnceMessageV2?.message?.imageMessage ||
    quoted.viewOnceMessageV2?.message?.videoMessage ||

    // Ephemeral
    quoted.ephemeralMessage?.message?.imageMessage ||
    quoted.ephemeralMessage?.message?.videoMessage ||

    // ⚠️ Android / new WA behavior
    (quoted.imageMessage?.viewOnce ? quoted.imageMessage : null) ||
    (quoted.videoMessage?.viewOnce ? quoted.videoMessage : null);


        if (!mediaMsg) {
            return sock.sendMessage(jid, {
                text: '❌ Not a view-once image or video'
            });
        }

        const mediaType = mediaMsg.mimetype?.startsWith('video')
            ? 'video'
            : 'image';

        // ✅ Correct Baileys download
        const stream = await downloadContentFromMessage(mediaMsg, mediaType);
        let buffer = Buffer.alloc(0);

        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        if (!buffer.length) {
            return sock.sendMessage(jid, { text: '❌ Failed to extract media' });
        }

        // Send extracted media
        await sock.sendMessage(jid, mediaType === 'image'
            ? { image: buffer, caption: `✅ View Once Image\n👤 ${senderName}` }
            : { video: buffer, caption: `✅ View Once Video\n👤 ${senderName}` }
        );

    } catch (err) {
        console.error('❌ ViewOnce Error:', err);
        await sock.sendMessage(m.key.remoteJid, {
            text: `❌ Error: ${err.message}`
        });
    }
}

export function isViewOnceCommand(m) {
    const text =
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        '';
    return text.trim().toLowerCase() === '.vv';
}
