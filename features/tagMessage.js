// features/tagMessage.js
import { log } from '../utils/logger.js';

export async function tagWithMessage(sock, jid, text, senderName) {
    try {
        // Check if it's a group
        if (!jid.endsWith('@g.us')) {
            await sock.sendMessage(jid, { 
                text: '❌ This command only works in groups!' 
            });
            return;
        }

        // Extract message from .tag command
        const message = text.replace(/^\.tag\s+/i, '').trim();
        
        if (!message) {
            await sock.sendMessage(jid, { 
                text: '❌ Please provide a message!\nUsage: `.tag Hello everyone!`' 
            });
            return;
        }

        log.cmd(senderName, `Tagging with message: "${message}"`);
        
        // Get group metadata
        const groupMetadata = await sock.groupMetadata(jid);
        const participants = groupMetadata.participants;
        
        if (participants.length === 0) {
            await sock.sendMessage(jid, { text: '❌ No members found in this group!' });
            return;
        }

        // Create mentions and mention text
        const mentions = participants.map(p => p.id);
        const mentionText = participants.map(p => `@${p.id.split('@')[0]}`).join(' ');
        
        // Count members
        const totalMembers = participants.length;
        
        // Create the final message
        const finalMessage = `${message}\n\n${mentionText}\n\n📊 Tagged: ${totalMembers} members\n👤 By: ${senderName}`;
        
        // Send message with mentions
        await sock.sendMessage(jid, {
            text: finalMessage,
            mentions: mentions
        });
        
        log.ok(`Tagged ${totalMembers} members with custom message`);
        
    } catch (error) {
        log.err(`Failed to tag with message: ${error.message}`);
        await sock.sendMessage(jid, { 
            text: '❌ Failed to tag members. Make sure I have admin permissions!' 
        });
    }
}

// Check if it's a tag command
export function isTagMessageCommand(m) {
    const text = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
    return text.toLowerCase().startsWith('.tag') && 
           !text.toLowerCase().startsWith('.tagall'); // Exclude .tagall if exists
}
