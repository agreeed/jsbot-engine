const { simpleEmbed } = require('../mainlib.js')
const { client } = require('../../index.js')


module.exports = {
  name: "ban",
  async execute(ctx, arg, ...reason) {
    const user = await ctx.guild.members.fetch(ctx.parseping(arg) ?? ctx.author.id)
    user.ban(
      typeof(reason)=='string' ? reason.join(' ') : undefined
    )
    
    return await ctx.channel.send(`Banned \`${user.user.tag}\` for ${typeof(reason)=='string' ? reason.join(' ') : "No reason defined"}`)
  }
}
