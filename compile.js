// For cross platform compatibility windows and unix base system
const path  = require('path');
const fs    = require('fs');
const solc  = require('solc');

const inboxPath = path.resolve(__dirname,'contracts','Inbox.sol');
const source    = fs.readFileSync(inboxPath, 'utf8');

// Direct access for the bytcode for the object
module.exports  = solc.compile(source,1).contracts[':Inbox'];