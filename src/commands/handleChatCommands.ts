import type { Bot } from "mineflayer";
import { movement, jumpAndMove, faceDirection, comeToPlayer, moveToCoordinates } from "../actions/movement";
import { config } from "../index";
import { collectBlock } from "../actions/collectBlock";
import { dropBlock, dropAllBlocks } from "../actions/dropBlock";

let autoalign = false;
let isBusy = false;

export const handleChatCommands = (
  bot: Bot,
  username: string,
  message: string
) => {
  if (isBusy && message !== ".stop") {
    bot.chat("I'm currently busy, please wait or use .stop to interrupt.");
    return;
  }

  if (!isOp(username)) {
    handleNonOpResponse(bot);
    return;
  }

  bot.chat("Yes master...");
  const [command, ...args] = message.split(" ");

  switch (command) {
    case ".move":
      handleMoveCommand(bot, args);
      break;
    case ".jump":
      handleJumpCommand(bot, args);
      break;
    case ".jumpmove":
      handleJumpMoveCommand(bot, args);
      break;
    case ".face":
      handleFaceCommand(bot, args);
      break;
    case ".autoalign":
      handleAutoalignCommand(bot);
      break;
    case ".collect":
      handleCollectBlock(bot, args);
      break;
    case ".drop":
      handleDropBlock(bot, args);
      break;
    case ".come":
      handleComeCommand(bot, username);
      break;
    case ".moveto":
      handleMoveToCommand(bot, args);
      break;
    case ".stop":
      handleStopCommand(bot);
      break;
    case ".help":
      handleHelpCommand(bot);
      break;
    case ".quit":
      handleQuitCommand(bot);
      break;
    default:
      bot.chat("Unknown command");
  }
};

const isOp = (username: string): boolean => {
  return config.ops.includes("everyone") || config.ops.includes(username);
};

const handleMoveCommand = (bot: Bot, args: string[]) => {
  if (args.length < 2) {
    bot.chat("Usage: .move <direction> <blocks>");
    return;
  }

  const [direction, blocksStr] = args;
  const blocks = parseInt(blocksStr, 10);

  if (isNaN(blocks)) {
    bot.chat("blocks must be a number");
    return;
  }

  movement(bot, direction, blocks, autoalign);
};

const handleCollectBlock = async (bot: Bot, args: string[]) => {
  if (args.length < 1) {
    bot.chat("Usage: .collect <block_id> [quantity]");
    return;
  }

  const block = args[0];
  const quantity = parseInt(args[1], 10) || 1; // Default to 1 if quantity is not provided
  console.log(block, quantity);

  if (isNaN(quantity) || quantity < 1) {
    bot.chat("Quantity must be a positive number");
    return;
  }

  isBusy = true;
  await collectBlock(bot, block, quantity);
  isBusy = false;
};

const handleDropBlock = async (bot: Bot, args: string[]) => {
  if (args.length < 1) {
    bot.chat("Usage: .drop <block_id> | .drop all");
    return;
  }

  const block = args[0];
  isBusy = true;
  if (block === "all") {
    await dropAllBlocks(bot);
  } else {
    await dropBlock(bot, block);
  }
  isBusy = false;
};

const handleJumpCommand = (bot: Bot, args: string[]) => {
  if (args.length < 1) {
    bot.chat("Usage: .jump <times>");
    return;
  }

  const times = parseInt(args[0], 10);

  if (isNaN(times)) {
    bot.chat("Times must be a number");
    return;
  }

  movement(bot, "jump", times, autoalign);
};

const handleJumpMoveCommand = (bot: Bot, args: string[]) => {
  if (args.length < 2) {
    bot.chat("Usage: .jumpmove <direction> <blocks>");
    return;
  }

  const [direction, blocksStr] = args;
  const blocks = parseInt(blocksStr, 10);

  if (isNaN(blocks)) {
    bot.chat("blocks must be a number");
    return;
  }

  jumpAndMove(bot, direction, blocks, autoalign);
};

const handleFaceCommand = (bot: Bot, args: string[]) => {
  if (args.length < 1) {
    bot.chat("Usage: .face <direction>");
    return;
  }

  const [direction] = args;
  faceDirection(bot, direction);
};

const handleAutoalignCommand = (bot: Bot) => {
  autoalign = !autoalign;
  bot.chat(`Autoalign is now ${autoalign ? "enabled" : "disabled"}`);
};

const handleHelpCommand = (bot: Bot) => {
  bot.chat("Available commands:");
  bot.chat(
    ".move <direction> <blocks> - Move in a direction for a number of blocks"
  );
  bot.chat(".jump <times> - Jump a number of times");
  bot.chat(
    ".jumpmove <direction> <blocks> - Jump and then move in a direction for a number of blocks"
  );
  bot.chat(".face <direction> - Face a direction (north, south, east, west)");
  bot.chat(".autoalign - Toggle auto-alignment to block grid");
  bot.chat(".help - List available commands");
  bot.chat(".quit - Disconnect the bot from the server");
};

const handleQuitCommand = (bot: Bot) => {
  bot.chat("Goodbye, master.");
  bot.quit();
};

const handleNonOpResponse = (bot: Bot) => {
  const { ops } = config;

  if (ops.length === 0) {
    bot.chat("I have no master, I am free!");
  } else if (ops.length === 1) {
    bot.chat(`You are not my master, my master is: ${ops[0]}`);
  } else {
    bot.chat(`You are not my master, my masters are: ${ops.join(", ")}`);
  }
};

const handleStopCommand = (bot: any) => {
    bot.collectBlock.cancelTask();
    bot.chat("Current command stopped.");
};

const handleComeCommand = async (bot: Bot, username: string) => {
  await comeToPlayer(bot, username);
};

const handleMoveToCommand = async (bot: Bot, args: string[]) => {
  if (args.length < 3) {
    bot.chat("Usage: .moveto <x> <y> <z>");
    return;
  }

  const [xStr, yStr, zStr] = args;
  const x = parseFloat(xStr);
  const y = parseFloat(yStr);
  const z = parseFloat(zStr);

  if (isNaN(x) || isNaN(y) || isNaN(z)) {
    bot.chat("Coordinates must be numbers");
    return;
  }

  await moveToCoordinates(bot, x, y, z);
};