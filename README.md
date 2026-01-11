
# W-Bot - WhatsApp Multi-Feature Bot

A simple but powerful WhatsApp bot with sticker creation, view-once image handling, group tagging utilities and more!

Built with Node.js + Baileys (Multi-Device)

## Features

- Convert images to WhatsApp stickers → `.sticker`
- Open/View view-once images → `open` or `viewonce` + reply to .vv image
- Tag all group members → `!tagall`
- Tag all members with custom message → `.tag hi` / `.tag Good morning everyone!`
- (more features coming soon...)

## Quick Installation

```bash
# 1. Clone the repository
git clone https://github.com/Abdullahi12022/w-bot.git
cd w-bot

# 2. Make scripts executable (Linux/macOS)
chmod +x build.sh start.sh

# 3. Run installer (will ask for your Groq API key)
./build.sh
