const { EmbedBuilder } = require('discord.js');

const permlevel = {
  0: [
    "1175716583285477436",
  ],
  1: [
    "1175716583285477436",
  ],
  9: [
    "1175716583285477436",
  ],
  10: [
    "1175716583285477436",
  ]
}

module.exports = {
  version: '29w04a',
  maintenance: false,
  wait(ms) {return setTimeout(()=>{},ms)},
  
  include(a, b) {
    for (const i in b) {
      if (b[i] == a) return true
    }
    return false
  },
  
  blist: [
    "700909872631382048"
  ],

  now() {
    return BigInt(Math.round(Date.now() / 1000))
  },

  secondsToString(seconds) {
    var numhours = seconds / 3600n
    var numminutes = (seconds % 3600n) / 60n;
    return numhours + " hours and " + numminutes + " mins";  
  },

  secondsToMinsString(seconds) {
    var numminutes = seconds / 60n;
    return numminutes + " mins";
  },

  knockoutString(seconds) {
    var numminutes = seconds / 60n;
    return (numminutes + 1n) + " minutes";
  },
  
  secondsToSecsString(seconds) {
    return seconds + " seconds";
  },
  
  blacklisted(ctxid) {
    if (module.exports.include(ctxid.toString(), module.exports.blist)) return true
    return false
  },
  
  checkPermission(ctxid, permission) {  
    if (module.exports.include(
      ctxid.toString(),
      permlevel[permission]
    )) return true
  
    return false
  },
  
  simpleEmbed(desc) {
    return { embeds: [new EmbedBuilder()
      .setColor(0x00FFFF)
      .setDescription(desc)]
           }
  },

  formatarg(arg, id) {
    return arg
      .replaceAll("<", "")
      .replaceAll("@", "")
      .replaceAll("!", "")
      .replaceAll("&", "")
      .replaceAll(",", "")
      .replaceAll(">", "")
      
      .replaceAll("myid", id)
  },

  formatarg_bank(arg, id, user) {
    return arg
      .replaceAll("<", "")
      .replaceAll("@", "")
      .replaceAll(",", "")
      .replaceAll(">", "")
      
      .replaceAll("myid", id)
      
      .replaceAll("allmoney", user.balance.toString())
      .replaceAll("allbeer", user.beer.toString())
      .replaceAll("allshares", user.shares.toString())
  },

  cropcd(cd, offset) {
    function secondsToString(seconds) {
      var numhours = seconds / 3600n
      var numminutes = (seconds % 3600n) / 60n;
      return "Ready in " + numhours + " hrs and " + numminutes + " min";  
    }
    
    const diff = module.exports.now() - BigInt(cd) - offset
    if (offset < diff + offset) {
      return "READY"
    } else {
      return secondsToString(-diff)
    }
  },

  calcformat(expression, id, user) {
    return expression
      .replaceAll(",", "")
      .replaceAll("allmoney", user.balance)
      .replaceAll("allbeer", user.beer)
      .replaceAll("allweed", user.weed)
      .replaceAll("allshares", user.shares)
      .replaceAll("myid", id.toString())
  },

  cooldown(user, aspect, cooldown) {
    if (!user.cooldowns[aspect])
      user.cooldowns[aspect] = 0n
    console.log(user.cooldowns[aspect])
    
    if (module.exports.now() > user.cooldowns[aspect]) {
      user.cooldowns[aspect] = module.exports.now() + cooldown
      return [false, user]
    } else {
      return [true, user]
    }
  }
}