# jfkbot

`jfkbot` is a Minecraft bot that can perform various actions in the game. This bot is built using the [mineflayer](https://github.com/PrismarineJS/mineflayer) library and can be customized to perform different actions based on chat commands.

## Features

- Move in different directions based on chat commands
- Customizable commands and actions
- Easy to set up and use

## Prerequisites

- [Bun](https://bun.sh) v1.2.2 or higher
- Minecraft server

## Installation

To install the dependencies, run:

```bash
bun install
```

## Adding Operators

The bot uses an operator list to determine who can issue commands. Create a file named `configs/op.json` with the following content:

```json
{
  "ops": ["your_username"]
}
```

Replace `"your_username"` with your actual Minecraft username.

## Running the Bot

To run the bot, use the following command:

```bash
bun run src/index.ts
```

## Usage

Once the bot is running, you can control it using chat commands in the Minecraft server. The bot currently supports the following commands:

- `.move <direction> <distance>`: Moves the bot in the specified direction for the given distance. Valid directions are `forward`, `back`, `left`, and `right`.

Example:

```text
.move forward 10
```

This command will move the bot forward for 10 blocks.

## Customizing Commands

You can customize the bot's commands by modifying the files in the `src/commands` directory. For example, `src/commands/handleChatCommands.ts` handles the chat commands and can be extended with additional functionality.

## Contributing

If you would like to contribute to the project, please fork the repository and submit a pull request. We welcome all contributions!

## License

This project is licensed under the MIT License.