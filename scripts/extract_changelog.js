const fs = require('fs');

const filePath = './CHANGELOG.md';

const fileContent = fs.readFileSync(filePath, 'utf-8');

const trimmedContent = fileContent
  .replace(/\s*#\s*freeRASP.*/, '') // trim the latest version header
  .replace(/\s*#\s*freeRASP([\s\S])*/, '') // trim everything after the latest changelog data
  .trim(); // trim leading and trailing whitespaces

console.log(trimmedContent);
