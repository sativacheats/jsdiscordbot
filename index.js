/*
index.js - your main "file"
I recommend to watch a youtube video to understand the code
Also make sure you installed everything right.
I use a simple command handler and a config file - my tip: never write a token in an index file.
I used v16.14.0 (node.js) & the newest discord.js version (feb. 2022)
*/


const Discord = require("discord.js")
const config = require("./config.json")

const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const fs = require("fs");

bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() ==="js")
    if(jsfile.length <= 0) {
        console.log("[codingLenny] - you don't have (correrct) command files.")
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`[codingLenny]${f} was found and got loaded.`);
        bot.commands.set(props.help.name, props);
    });
});

bot.on("ready", () => {
    console.time.log("[codingLenny] - bot started correctly.")
});

if(config.token === "YOUR_SECRET_TOKEN") return console.log("[codingLenny] - You have to change your token in config.json!")

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    let content = message.content.split(" ");
    let command = content[0];
    let args = content.slice(1);
    let prefix = config.prefix;
  
    let commandfile = bot.commands.get(command.slice(prefix.length));
    if(commandfile) commandfile.run(bot,message,args);
  })
  

bot.login(config.token)

