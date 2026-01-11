// features/ai.js
import { log } from '../utils/logger.js';
import Groq from 'groq-sdk';
import { config } from 'dotenv';
config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function aiReply(prompt, name) {
    try {
        const r = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { 
                    role: 'system', 
                    content: 'You are W-BOT, a helpful WhatsApp AI assistant created by AVDALLAH. Respond concisely.' 
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.6,
            max_tokens: 700
        });

        return r.choices[0]?.message?.content || '🤖 No response.';
    } catch (e) {
        return '🤖 I couldn\'t reply right now.';
    }
}
