import minecraftData from "minecraft-data";

export async function dropBlock(bot: any, block: string) {
  if (!block) {
    console.log("Block name is undefined.");
    return;
  }
  block = block.toLowerCase();
  const mcData = minecraftData(bot.version);
  const blockData = mcData.blocksByName[block];
  if (!blockData) {
    console.log(`Block ${block} is not a valid block name.`);
    return;
  }

  const items = bot.inventory.items();
  for (const item of items) {
    if (item.name === block) {
      await bot.tossStack(item);
      console.log(`Dropped ${item.count} ${block}.`);
    }
  }
}

export async function dropAllBlocks(bot: any) {
  const items = bot.inventory.items();
  for (const item of items) {
    await bot.tossStack(item);
    console.log(`Dropped ${item.count} ${item.name}.`);
  }
}
