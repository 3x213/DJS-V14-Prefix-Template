const { Client, Partials, Collection } = require("discord.js");
const config = require("./config");
const { readdirSync } = require('fs');
const path = require('path');

const client = new Client({
    intents: 3276799,
    shards: "auto",
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember
    ],
    autoReconnect: true
});

client.commands = new Collection();
client.aliases = new Collection();
client.config = require("./config");

console.log("[Index] Loading handlers")

// -----------> Commands Prefix Handler <-----------
console.log("[Handlers - Prefix] Loading Prefix Commands")

const rapidcmds = new Collection();
const rapidaliases = new Collection();

const commandDirectories = [
'./src/commands/public', 
];

for (const directory of commandDirectories) {
    let rfiles = readdirSync(directory);
    rfiles = rfiles.filter(file => file.endsWith('.js'));

    for (const file of rfiles) {
        const filePath = path.join(directory, file);

        try {
            const command = require(`./${filePath}`);
            const data = new command();

            rapidcmds.set(data.name, data);
            data.aliases.map(d => rapidaliases.set(d, data))
            console.log(`- ${config.prefix}${data.name} has successfully loaded!`);
        } catch (err) {
            console.error(`Error loading ${filePath}:`, err);
        }
    }
}

client.on("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return;

    let PREFIX = config.prefix;
    
    if (!message.content.startsWith(PREFIX)) return;

    const commandBody = message.content.slice(PREFIX.length).trim();
    const hasPrefixSpace = message.content.startsWith(PREFIX + ' ');
    
    if (hasPrefixSpace) return;
    
    let args = commandBody.split(/\s+/);
    
    if (args.length === 0 || !/^[a-zA-Z0-9]+$/.test(args[0])) return;
    
    const command = args.shift().toLowerCase();
            
    try {
        const commandFile = rapidcmds.get(command) || rapidaliases.get(command);
        if (!commandFile) return message.reply({ content: `:x: - Cette commande n'existe pas !` });
        await commandFile.execute(message, args, client);
    } catch (e) {
        console.log(e)
        return await message.reply({
            content: `Une erreur est survenu lors de l'éxécution de la commande !`
        });
    }
});
    console.log(`Successfully reloaded application (${config.prefix}) commands.`);
    console.log(`[Handlers - Prefix] Finished loading Prefix Command.`)

// -----------> Events Handler <-----------
console.log(`[Event Handler] Started loading events!`)

readdirSync("./src/events/").forEach(dir => {
    readdirSync(`./src/events/${dir}`).forEach(file => {
        try {
            const event = require(`./src/events/${dir}/${file}`);
            event.once ? client.once(event.name, (...args) => event.execute(client, ...args)) : client.on(event.name, (...args) => event.execute(client, ...args));
            console.log(`- Event ${event.name} has loaded`)
        } catch (err) {
            console.log(err);
        }
    });
});        
console.log(`[Event Handler] Finished loading events!`)

// Anti Crash
console.log(`[Anti Crash] Anti Crash has been operational!`)

process.on("unhandledRejection", err => {
    console.log(err)
})
process.on("uncaughtException", err => {
    console.log(err)
})
process.on("uncaughtExceptionMonitor", err => {
    console.log(err)
})
console.log("[Index] Finished loading handlers")

client.login(config.token)