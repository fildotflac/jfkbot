import type { Bot } from "mineflayer";
import { goals } from "mineflayer-pathfinder";

export const movement = (
  bot: Bot,
  direction: string,
  blocks: number,
  autoAlign: boolean
) => {
  const startPosition = bot.entity.position.clone();
  let targetDistance = blocks - 0.5;
  const hasReachedTarget = () => {
    const currentPosition = bot.entity.position;
    const distanceTraveled = currentPosition.distanceTo(startPosition);
    return distanceTraveled >= targetDistance;
  };

  const stopMovement = () => {
    bot.setControlState("forward", false);
    bot.setControlState("back", false);
    bot.setControlState("left", false);
    bot.setControlState("right", false);
    bot.setControlState("jump", false);
  };

  switch (direction.toLowerCase()) {
    case "forward":
      bot.setControlState("forward", true);
      break;
    case "back":
      bot.setControlState("back", true);
      break;
    case "left":
      bot.setControlState("left", true);
      break;
    case "right":
      bot.setControlState("right", true);
      break;
    case "jump":
      bot.setControlState("jump", true);
      break;
    default:
      bot.chat("Unknown direction. Use forward, back, left, right, or jump.");
      return;
  }

  const interval = setInterval(() => {
    if (hasReachedTarget()) {
      clearInterval(interval);
      stopMovement();
      if (autoAlign) {
        const currentPosition = bot.entity.position;
        console.log(
          `[Auto-align] Position BEFORE alignment: X: ${currentPosition.x}, Y: ${currentPosition.y}, Z: ${currentPosition.z}`
        );
        let alignedX = Math.round(currentPosition.x + 0.5) - 0.5;
        let alignedZ = Math.round(currentPosition.z + 0.5) - 0.5;
        console.log(
          `[Auto-align] Calculated aligned coords: X: ${alignedX}, Y: ${currentPosition.y}, Z: ${alignedZ}`
        );
        bot.entity.position.set(alignedX, currentPosition.y, alignedZ);
        const positionAfterAlignment = bot.entity.position;
        console.log(
          `[Auto-align] Position AFTER alignment: X: ${positionAfterAlignment.x}, Y: ${positionAfterAlignment.y}, Z: ${positionAfterAlignment.z}`
        );
        console.log(`Auto-aligned to: X: ${alignedX}, Z: ${alignedZ}`);
        bot.chat(`Auto-aligned to block grid.`);
      }
    }
  }, 100);
};

export const jumpAndMove = (
  bot: Bot,
  direction: string,
  blocks: number,
  autoAlign: boolean
) => {
  bot.setControlState("jump", true);
  bot.setControlState("jump", false);
  movement(bot, direction, blocks, autoAlign);
};

export const faceDirection = (bot: Bot, direction: string) => {
  let yaw;
  switch (direction.toLowerCase()) {
    case "north":
      yaw = 0;
      break;
    case "east":
      yaw = Math.PI / 2;
      break;
    case "south":
      yaw = Math.PI;
      break;
    case "west":
      yaw = -Math.PI / 2;
      break;
    default:
      bot.chat("Unknown direction. Use north, south, east, or west.");
      return;
  }
  bot.look(yaw, 0, true);
  bot.chat(`Facing ${direction}.`);
};

export const comeToPlayer = async (bot: Bot, username: string) => {
  const player = bot.players[username];
  if (!player || !player.entity) {
    bot.chat("I can't see you, master.");
    return;
  }

  const pathfinder = bot.pathfinder;
  const goal = new goals.GoalFollow(player.entity, 1);
  await pathfinder.goto(goal);
  bot.chat("I have arrived, master.");
};

export const moveToCoordinates = async (bot: Bot, x: number, y: number, z: number) => {
  const pathfinder = bot.pathfinder;
  const goal = new goals.GoalBlock(x, y, z);

  try {
    await pathfinder.goto(goal);
    bot.chat(`Arrived at coordinates (${x}, ${y}, ${z})`);
  } catch (err: any) {
    if (err.message.includes("Timeout")) {
      bot.chat("Pathfinding timed out. Retrying...");
      await moveToCoordinates(bot, x, y, z);
    } else {
      bot.chat(err.message);
      console.log(err);
    }
  }
};