import type { Bot } from 'mineflayer';
import { movement } from '../actions/movement';
import { config } from '../index';


export const handleChatCommands = (bot: Bot, username: string, message: string) => {
  if (isOp(username)) {
    bot.chat("Yes master...");
    const slices = message.split(' ');
    if (slices[0] === '.move') {
      handleMoveCommand(bot, slices);
    } else if (slices[0] === '.jump') {
      handleJumpCommand(bot, slices);
    }
  } else if (config.ops.length === 0) {
    bot.chat("I have no master, I am free!");
  } else if (config.ops.length === 1) {
    bot.chat("You are not my master, my master is: " + config.ops);
  } else {
    bot.chat("You are not my master, my masters are: " + config.ops);
  }
};

const isOp = (username: string): boolean => {
  return config.ops.includes(username);
};

const handleMoveCommand = (bot: Bot, slices: string[]) => {
  if (slices.length < 3) {
    bot.chat('Usage: .move <direction> <distance>');
    return;
  }

  const direction = slices[1];
  const distance = parseInt(slices[2], 10);

  if (isNaN(distance)) {
    bot.chat('Distance must be a number');
    return;
  } else {
    movement(bot, direction, distance);
  }
};

const handleJumpCommand = (bot: Bot, slices: string[]) => {
  if (slices.length < 2) {
    bot.chat('Usage: .jump <times>');
  }else {
    const times = parseInt(slices[1], 10);
    movement(bot, "jump", times)
  }



};