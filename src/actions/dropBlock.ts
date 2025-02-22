import minecraftData from "minecraft-data";

export async function dropBlock(bot: any, itemName: string) {
  if (!itemName) {
    console.log("Item name is undefined.");
    return;
  }
  itemName = itemName.toLowerCase();
  const mcData = minecraftData(bot.version);
  const itemData = mcData.itemsByName[itemName] || mcData.blocksByName[itemName];
  if (!itemData) {
    console.log(`Item ${itemName} is not a valid item or block name.`);
    return;
  }

  const items = bot.inventory.items();
  for (const item of items) {
    if (item.name === itemName) {
      await bot.tossStack(item);
      console.log(`Dropped ${item.count} ${itemName}.`);
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
