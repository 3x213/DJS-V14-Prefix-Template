const { ActivityType, Client } = require("discord.js")
const config = require("../../../config");
const cmd = require('node-cmd');

module.exports = {
    name: "ready",
    once: true,

    /**
     * 
     * @param {Client} client 
     */

    async execute(client) {
        
        cmd.run(`title ${client.user.displayName}`);

        client.user.setActivity(config.statut, { type: ActivityType.Playing });

        console.log(`[Bot - Ready] ${client.user.username} connected!`)   
    }
}