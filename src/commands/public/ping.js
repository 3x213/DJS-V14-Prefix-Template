const { PermissionFlagsBits } = require("discord.js");
const config = require("../../../config");

module.exports = class rapidcmds {
    name;
    description;
    aliases;
    use;
    permission;
    category;

    constructor() {
        this.name = "ping"
        this.description = "Permet de voir la latence du bot"
        this.aliases = [];
        this.use = `${config.prefix}ping`
        this.permission = PermissionFlagsBits.SendMessages
        this.category = "Public"
    }

    /** 
    * 
    * @param {Client} client 
    * @param {Array} args
    * @param {Message} message 
    */
    async execute(message, args, client) {
        const msg = await message.reply({ content: `🏓 Calcul de la latence...`, fetchReply: true });

        const latency = msg.createdTimestamp - message.createdTimestamp;
        const apiLatency = client.ws.ping;

        let latencyStatus;
        if (latency <= 200) {
            latencyStatus = "Faible";
        } else if (latency > 200 && latency <= 500) {
            latencyStatus = "Moyen";
        } else {
            latencyStatus = "Élevée";
        }

        msg.edit({ content: `🏓 Pong!\nLatence du bot : \`${latency}\`ms ( ${latencyStatus} )\nLatence de l'API Discord : \`${apiLatency}\`ms` })
    }
}