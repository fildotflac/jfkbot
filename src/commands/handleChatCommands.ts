import type { Bot } from "mineflayer";
import { movement, jumpAndMove, faceDirection } from "../actions/movement";
import { config } from "../index";

let autoalign = false;

export const handleChatCommands = (
  bot: Bot,
  username: string,
  message: string
) => {
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
    default:
      bot.chat("Unknown command");
  }
};

const isOp = (username: string): boolean => {
  return config.ops.includes(username);
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
