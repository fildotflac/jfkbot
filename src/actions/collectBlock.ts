import type { Bot } from "mineflayer";
import minecraftData from "minecraft-data";

async function collectBlock(bot: Bot, block: string) {
  const mcData = minecraftData(bot.version);
  const grass = bot.findBlock({
    matching: mcData.blocksByName.grass_block.id,
    maxDistance: 64,
  });
}
