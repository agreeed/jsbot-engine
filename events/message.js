const { Events } = require('discord.js');
const { client } = require('../index.js')
const fs = require('node:fs');
const path = require('node:path');

////////////////////
//                //
//    Commands    //
//                //

var commands = {}


async function reloadcommands(first) {
  const commandPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
  commands = {}
  
  for (const file of commandFiles) {
  	const filePath = path.join(commandPath, file);
    if (!first) {
      delete require.cache[require.resolve(filePath)]
    }
    const command = require(filePath);
    commands[command.name] = command
  }
  
}


async function reloadlib() {
  // delete from cache
  delete require.cache[require.resolve('./mainlib.js')]
  // require
  var mainlib = require('./mainlib.js')
}

reloadcommands(true)
console.log(commands)


module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(ctx) {
    
    if (ctx.author.bot) return
    
    if (ctx.content.startsWith('.')) {
      
      var mainlib = require('./mainlib.js')
      parsed = ctx.content.split(" ")
      cmd = parsed[0].replace(".","")
      
      args = parsed
      args[0] = ctx

      args[0].parseping = (str) => {
        if (!str)
          return
        return str
          .replaceAll("<","")
          .replaceAll("@","")
          .replaceAll("!","")
          .replaceAll(">","")
      }
      

      if (cmd == ',reload' && mainlib.checkPermission(ctx.author.id, 0) && !ctx.recruit) {
        try{
          reloadlib().then(()=>{
            reloadcommands(false).then(()=>{
              ctx.channel.send(`Successfully reloaded bot.\n\`mainlib version: ${mainlib.version}\`\n\`commands: ${Object.keys(commands).length}\``)
            })
          })
        }catch(e){
          ctx.channel.send(`An internal error occured whilst trying to reload!\n\`\`\`\n${e}\n\`\`\``)
        }
        return
      }

      if (cmd == ',adminexec' && mainlib.checkPermission(ctx.author.id, 0) && !ctx.recruit) {
        parsed = ctx.content.split(" ")
        cmd = parsed[2].replace(",","")
      
        args = parsed
        args.shift()
        args.shift()
        
        args[0] = ctx
        args[0].author =
          await client.users.fetch(ctx.content.split(" ")[1])
      }
      
      if (commands[cmd]) {
        if (commands[cmd].permlevel) {
          if (!mainlib.checkPermission(ctx.author.id, commands[cmd].permlevel))
            return ctx.reply(`You dont have enough permission to use command \`,${cmd}\``)
        }
        
        try {
          await commands[cmd].execute(...args)
        } catch(e) {
          await ctx.channel.send(`An internal error occurred!`)
          console.log(e.stack)
        }
      }
    }
	},
};
