import fs from 'fs';
const mainjs = fs.readFileSync('src/main.js', 'utf8');
const matches = mainjs.match(/id:\s*'ticketsure'/g);
console.log("Found TicketSure in main.js: ", matches ? matches.length : 0);
