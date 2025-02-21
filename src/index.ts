import type { Bot } from "mineflayer";
import mineflayer from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import { getCredentials } from "./utils/getCredentials";
import { askQuestion, rl } from "./utils/askQuestion";
import { handleChatCommands } from "./commands/handleChatCommands";

interface BotConfig {
  host: string;
  port: number;
  version?: string;
  username: string;
  auth: "mojang" | "microsoft" | "offline";
  password?: string;
  ops: string[];
}

let bot: Bot;

export const config = await getCredentials();

const createBot = async (config: BotConfig, spawnViewer: string) => {
  bot = mineflayer.createBot(config);

  //PLUGINS

  bot.loadPlugin(require("mineflayer-collectblock").plugin);

  //END
  bot.once("spawn", () => {
    console.log("Bot spawned");
    if (
      spawnViewer.toLowerCase() === "yes" ||
      spawnViewer.toLowerCase() === "y"
    ) {
      mineflayerViewer(bot, { port: 3007, firstPerson: false });
      console.log("Viewer available at http://localhost:3007");
    }
  });

  bot.on("chat", (username, message) => {
    console.log(`Message from ${username}: ${message}`);
    if (username === bot.username) return;

    if (message.startsWith(".")) {
      console.log(`Command detected: ${message}`);
      handleChatCommands(bot, username, message);
    }
  });
};

const startBot = async () => {
  const spawnViewer = await askQuestion(
    "Would you like to start webView? (Y/n)",
    "yes"
  );
  await createBot(config, spawnViewer);
  rl.close();
};

startBot();
