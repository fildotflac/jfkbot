import type { Bot } from 'mineflayer';

export const moveBlocks = (bot: Bot, direction: string, distance: number) => {
  const duration = distance * 245; // 245 ms per block

  console.log(`Moving ${direction} for ${distance} blocks (duration: ${duration} ms)`);

  switch (direction.toLowerCase()) {
    case 'forward':
      bot.chat(`Moving forward ${distance} blocks`);
      bot.setControlState('forward', true);
      setTimeout(() => bot.setControlState('forward', false), duration);
      break;
    case 'back':
      bot.chat(`Moving back ${distance} blocks`);
      bot.setControlState('back', true);
      setTimeout(() => bot.setControlState('back', false), duration);
      break;
    case 'left':
      bot.chat(`Moving left ${distance} blocks`);
      bot.setControlState('left', true);
      setTimeout(() => bot.setControlState('left', false), duration);
      break;
    case 'right':
      bot.chat(`Moving right ${distance} blocks`);
      bot.setControlState('right', true);
      setTimeout(() => bot.setControlState('right', false), duration);
      break;
    default:
      bot.chat('Unknown direction. Use forward, back, left, or right.');
  }
};