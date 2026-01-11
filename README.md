
# W-Bot - WhatsApp Multi-Feature Bot

A simple but powerful WhatsApp bot with sticker creation, view-once image handling, group tagging utilities and more!

Built with Node.js + Baileys (Multi-Device)

## Features

- Convert images to WhatsApp stickers → `.sticker`
- Open/View view-once images → `open` or `viewonce` + reply to .vv image
- Tag all group members → `!tagall`
- Tag all members with custom message → `.tag hi` / `.tag Good morning everyone!`
- (more features coming soon...)



Installation Commands

For Termux Users (Android):

```bash
pkg update && pkg upgrade -y
pkg install git -y
git clone https://github.com/Abdullahi12022/w-bot.git
cd w-bot
chmod +x build.sh start.sh
./build.sh
```

For Linux/macOS Users:

```bash
git clone https://github.com/Abdullahi12022/w-bot.git
cd w-bot
chmod +x build.sh start.sh
./build.sh
```