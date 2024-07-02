const fs = require('fs');

const filePath = './CHANGELOG.md';

const fileContent = fs.readFileSync(filePath, 'utf-8');

const trimmedContent = fileContent
  .replace(/([\s\S]*?)\s*(?=\s*##)/, '') // trim the # Changelog part
  .replace(/\s*##\s*\[\d+\.\d+\.\d+\] - \d{4}-\d{2}-\d{2}.*/, '') // trim the latest version header
  .replace(/\s*##\s*\[\d+\.\d+\.\d+\] - \d{4}-\d{2}-\d{2}([\s\S])*/, '') // trim everything after the latest changelog data
  .trim(); // trim leading and trailing whitespaces

console.log(trimmedContent);
