import type { Bot } from 'mineflayer';
import fs from 'fs';
import { moveBlocks } from '../actions/moveBlocks';

interface OpList {
  ops: string[];
}

export const handleChatCommands = (bot: Bot, username: string, message: string) => {
  if (isOp(username)) {
    const args = message.split(' ');
    if (args[0] === '.move') {
      handleMoveCommand(bot, args);
    }
  }
};

const isOp = (username: string): boolean => {
  const opData: OpList = JSON.parse(fs.readFileSync('configs/op.json', 'utf-8'));
  return opData.ops.includes(username);
};

const handleMoveCommand = (bot: Bot, args: string[]) => {
  if (args.length < 3) {
    bot.chat('Usage: .move <direction> <distance>');
    return;
  }

  const direction = args[1];
  const distance = parseInt(args[2], 10);

  if (isNaN(distance)) {
    bot.chat('Distance must be a number');
    return;
  }

  moveBlocks(bot, direction, distance);
};