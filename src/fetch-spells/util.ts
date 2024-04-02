export const nameFromUrl = (url: string) => url.replace(/^\/spells?:/i, '');

export const consoleLogEmphasis = (message: string) => {
  const bar = `${new Array(message.length + 4).fill('━').join('')}`;

  console.log(`\n┏${bar}┓\n┃  ${message}  ┃\n┗${bar}┛\n`);
};
