// features/mediaDownloader.js
import { log } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';

export async function downloadMedia(sock, m, senderName) {
    try {
        let mediaBuffer, filename;
        
        // Determine media type
        if (m.message.imageMessage) {
            mediaBuffer = await sock.downloadMediaMessage(m);
            filename = `image_${Date.now()}.jpg`;
        } else if (m.message.videoMessage) {
            mediaBuffer = await sock.downloadMediaMessage(m);
            filename = `video_${Date.now()}.mp4`;
        } else if (m.message.audioMessage) {
            mediaBuffer = await sock.downloadMediaMessage(m);
            filename = `audio_${Date.now()}.ogg`;
        } else if (m.message.documentMessage) {
            mediaBuffer = await sock.downloadMediaMessage(m);
            const docName = m.message.documentMessage.fileName || 'document';
            filename = `${docName}_${Date.now()}`;
        } else {
            return null;
        }
        
        // Save to temp directory
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        const filepath = path.join(tempDir, filename);
        fs.writeFileSync(filepath, mediaBuffer);
        
        log.ok(`Media downloaded: ${filename} (${mediaBuffer.length} bytes)`);
        
        return {
            buffer: mediaBuffer,
            path: filepath,
            filename: filename
        };
        
    } catch (error) {
        log.err(`Failed to download media: ${error.message}`);
        return null;
    }
}

// Check for media download commands
export function isDownloadCommand(m) {
    const text = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
    
    const commands = ['.dl', '!dl', '@wbot dl', '.download', '!download'];
    return commands.includes(text.toLowerCase()) && 
           (m.message.imageMessage || m.message.videoMessage || 
            m.message.audioMessage || m.message.documentMessage);
}
