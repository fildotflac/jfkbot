import readline from 'readline';

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const askQuestion = (query: string, defaultValue: string): Promise<string> => {
  return new Promise((resolve) =>
    rl.question(`${query}`, (answer) =>
      resolve(answer || defaultValue)
    )
  );
};