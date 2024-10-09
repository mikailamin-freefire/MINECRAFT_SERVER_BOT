const mineflayer = require('mineflayer');
const AutoAuth = require('mineflayer-auto-auth');
const pvp = require('mineflayer-pvp').plugin;
const express = require("express");

const server_ip = process.env.SERVER_IP;
const server_port = process.env.SERVER_PORT;
const bot_username = process.env.BOT_USERNAME;

const app = express();
        app.use(express.json());
        app.get("/", (_, res) => res.send("Server bot is now live"));
        app.listen(process.env.SERVER_PORT);

function initialize_bot() {
    const bot = mineflayer.createBot({
        host: server_ip,
        version: false,
        username: bot_username,
        port: server_port,
        plugins: [AutoAuth],
        AutoAuth: 'bot112022'
    });

    bot.loadPlugin(pvp);

    bot.on('physicTick', () => {
        const filter = entity => entity.type === 'mob' && (entity.displayName === 'Zombie' || entity.displayName === 'Creeper' || entity.displayName === 'Skeleton' || entity.displayName === 'Spider');
        const entity = bot.nearestEntity(filter);
        if (entity) bot.pvp.attack(entity);
    });

    bot.on('login', () => {
        console.log("Congratulations, your bot has been logged in to the server!");
    });

    bot.on('end', () => {
        console.error("Bot has been disconnected from the server!");
        console.log("Restarting...");
        initialize_bot();
    });
}

initialize_bot();
