import { mcData } from "../index";

export async function collectBlock(bot: any, block: string, quantity: number) {
  const blockId = mcData.blocksByName[block]?.id;

  if (!blockId) {
    bot.chat(`Invalid block name: ${block}`);
    return;
  }

  const blocks = bot.findBlocks({
    matching: blockId,
    maxDistance: 512,
    count: quantity,
  });

  if (blocks.length === 0) {
    bot.chat(`No instance of block: ${block} found`);
    return;
  }

  try {
    const targets = blocks.map((pos: any) => bot.blockAt(pos)).filter((block: any) => block !== null);
    if (targets.length === 0) {
      bot.chat(`No valid blocks found to collect`);
      return;
    }

    await bot.collectBlock.collect(targets);
    bot.chat(`Stopped collecting ${block}`);
  } catch (err: any) {
    bot.chat(err.message);
    console.log(err);
  }
}