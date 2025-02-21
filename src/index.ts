import type { Bot } from 'mineflayer';
import mineflayer from 'mineflayer';
import { mineflayer as mineflayerViewer } from 'prismarine-viewer';
import readline from 'readline';
import { getCredentials } from './utils/getCredentials';
import { rl } from './utils/askQuestion';
import { handleChatCommands } from './commands/handleChatCommands';

interface OpList {
  ops: string[];
}

interface BotConfig {
  host: string;
  port: number;
  version?: string;
  username: string;
  auth: 'mojang' | 'microsoft' | 'offline';
  password?: string;
}

let bot: Bot;

const createBot = async (config: BotConfig) => {
  bot = mineflayer.createBot(config);

  bot.once('spawn', () => {
    console.log('Bot spawned');
    mineflayerViewer(bot, { port: 3007, firstPerson: false });
    console.log('Viewer available at http://localhost:3007');

    bot.chat('/give @p minecraft:iron_axe 1'); // Give the bot an iron axe to mine logs
    startMiningOakLogs();
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    handleChatCommands(bot, username, message);
  });
};

const startMiningOakLogs = async () => {
  console.log('Starting to mine oak logs...');
  bot.chat('Starting to mine oak logs...');
  // Implement the logic to find and mine oak logs
};

const startBot = async () => {
  const config = await getCredentials();
  await createBot(config);
  rl.close();
};

startBot();