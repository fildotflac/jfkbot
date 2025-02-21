import fs from "fs";
import { askQuestion } from "./askQuestion";

interface BotConfig {
  host: string;
  port: number;
  version?: string;
  username: string;
  auth: "mojang" | "microsoft" | "offline";
  password?: string;
  ops: string[];
}

export const getCredentials = async (): Promise<BotConfig> => {
  const config = await loadBotConfig();
  if (config) {
    return config;
  }
  return await askConfigQuestions();
};

const askConfigQuestions = async (): Promise<BotConfig> => {
  const host = await askQuestion(
    "Enter server host [localhost]: ",
    "localhost"
  );
  const port = await askQuestion("Enter server port [25565]: ", "25565");
  const version = await askQuestion(
    "Enter server version (e.g., 1.19.2, leave blank for auto): ",
    ""
  );
  const auth = (await askQuestion(
    "Enter authentication type ([offline], microsoft, mojang): ",
    "offline"
  )) as "mojang" | "microsoft" | "offline";

  let username;
  let password;
  if (auth === "mojang" || auth === "microsoft") {
    username = await askQuestion("Enter bot email", "");
    password = await askQuestion("Enter bot password", "");
  } else {
    username = await askQuestion("Enter bot username [bot]: ", "bot");
  }

  const opsInput = await askQuestion(
    "Enter operator usernames (e.g., AKAOnTop, FilDotSh) or type 'everyone' to allow all users: ",
    ""
  );
  const ops =
    opsInput.toLowerCase() === "everyone"
      ? ["everyone"]
      : opsInput.split(",").map((op) => op.trim());

  const saveConfig = await askQuestion(
    "Would you like to save this config? (y/N)",
    "no"
  );
  if (saveConfig.toLowerCase() === "yes" || saveConfig.toLowerCase() === "y") {
    const configName = await askQuestion("Enter config name: ", "default");
    saveBotConfig(configName, {
      host,
      port: parseInt(port),
      version,
      username,
      auth,
      password,
      ops,
    });
  }

  return {
    host,
    port: parseInt(port, 10),
    version,
    username,
    auth,
    password,
    ops,
  };
};

const saveBotConfig = (configName: string, config: BotConfig) => {
  if (!fs.existsSync("configs")) {
    fs.mkdirSync("configs");
  }

  fs.writeFileSync(
    `configs/${configName}.json`,
    JSON.stringify(config, null, 2)
  );
  console.log(`Config saved as configs/${configName}.json`);
};

const loadBotConfig = async (): Promise<BotConfig | null> => {
  if (!fs.existsSync("configs")) {
    return null;
  }

  const files = fs
    .readdirSync("configs")
    .filter((file) => file.endsWith(".json"));
  if (files.length === 0) {
    return null;
  }

  console.log("Config files found:");
  files.forEach((file, index) => {
    console.log(`${index + 1}) ${file}`);
  });

  const loadConfig = await askQuestion(
    "Would you like to load a config? (Y/n)",
    "yes"
  );
  if (loadConfig.toLowerCase() === "yes" || loadConfig.toLowerCase() === "y") {
    const index = await askQuestion(`Enter config number [1]: `, "1");
    const configIndex = parseInt(index, 10) - 1;
    if (configIndex >= 0 && configIndex < files.length) {
      const configPath = `configs/${files[configIndex]}`;
      const config: BotConfig = JSON.parse(
        fs.readFileSync(configPath, "utf-8")
      );
      return config;
    } else {
      console.log(
        "Invalid config number, proceeding with manual configuration."
      );
    }
  }

  return null;
};
