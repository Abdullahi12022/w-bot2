// features/tagAll.js
import { log } from '../utils/logger.js';

export async function tagAllMembers(sock, jid, senderName) {
    try {
        // Check if it's a group
        if (!jid.endsWith('@g.us')) {
            await sock.sendMessage(jid, { text: '❌ This command only works in groups!' });
            return;
        }

        log.cmd(senderName, 'Tagging all group members');
        
        // Get group metadata
        const groupMetadata = await sock.groupMetadata(jid);
        const participants = groupMetadata.participants;
        
        // Create mentions
        const mentions = participants.map(p => p.id);
        const mentionText = participants.map(p => `@${p.id.split('@')[0]}`).join(' ');
        
        // Send message with mentions
        await sock.sendMessage(jid, {
            text: `📢 Attention everyone!\n${mentionText}`,
            mentions: mentions
        });
        
        log.ok(`Tagged ${participants.length} members in group`);
        
    } catch (error) {
        log.err(`Failed to tag members: ${error.message}`);
        await sock.sendMessage(jid, { text: '❌ Failed to tag members. Make sure I have admin permissions!' });
    }
}
