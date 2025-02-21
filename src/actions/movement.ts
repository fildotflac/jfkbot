import type { Bot } from 'mineflayer';

export const movement = (bot: Bot, direction: string, times: number) => {

  switch (direction.toLowerCase()) {
    case 'forward':
      bot.setControlState('forward', true);
      setTimeout(() => bot.setControlState('forward', false), times * 245);
      break;
    case 'back':
      bot.setControlState('back', true);
      setTimeout(() => bot.setControlState('back', false), times * 245);
      break;
    case 'left':
      bot.setControlState('left', true);
      setTimeout(() => bot.setControlState('left', false), times * 245);
      break;
    case 'right':
      bot.setControlState('right', true);
      setTimeout(() => bot.setControlState('right', false), times * 245);
      break;
    case 'jump':
      if(isNaN(times)){
        bot.setControlState('jump', true);
        bot.setControlState('jump', false);
        break;
      } else {
        bot.setControlState('jump', true);
        console.log(times);
        setTimeout(() => bot.setControlState('jump', false), times * 500);
        break;
      }
    default:
      bot.chat('Unknown direction. Use forward, back, left, right, or jump.');
  }
};