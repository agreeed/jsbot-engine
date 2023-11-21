const fs = require('node:fs');
const path = require('node:path');
const { Client, IntentsBitField } = require('discord.js');
const intents = new IntentsBitField();
intents.add(
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
  IntentsBitField.Flags.DirectMessages
)
const token = process.env.TOKEN;
//1135429183707820124
module.exports = {
  client: new Client({
    partials: ["CHANNEL"],
    intents: intents
  }),

  getclient() {
    return module.exports.client
  }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
  if (filePath.toString().search('mainlib')==-1) {
  	if (event.once) {
  		module.exports.client.once(event.name, (...args) => event.execute(...args));
  	} else {
  		module.exports.client.on(event.name, (...args) => event.execute(...args));
  	}
  }
}

module.exports.client.login(token);