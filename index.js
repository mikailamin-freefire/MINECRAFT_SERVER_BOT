const express = require("express");
const http = require("http");
const mineflayer = require('mineflayer')
const pvp = require('mineflayer-pvp').plugin
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder')
const armorManager = require('mineflayer-armor-manager')
const mc = require('minecraft-protocol');
const AutoAuth = require('mineflayer-auto-auth');

const app = express();
app.use(express.json());

const server_ip = 'ew_mc.aternos.me';
const server_port = 40669;
const bot_username = 'AI_MANAGER';

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
    bot.loadPlugin(pathfinder);

    bot.on('physicTick', () => {
        const filter = entity => entity.type === 'mob' && entity.displayName === 'Zombie' || entity.displayName === 'Creeper' || entity.displayName === 'Skeleton' || entity.displayName === 'Spider';
        const entity = bot.nearestEntity(filter);
        if (entity) bot.pvp.attack(entity);
    });

    bot.on('login', (spawn) => {
        console.log("Congratulations, your bot has been logged in to the server!");
        app.get("/", (_, res) => res.send("Your bot has now live"));
        app.listen(process.env.PORT);
    });

    bot.on('end', (reason) => {
        console.error("Bot has been disconnected from the server!");
        console.log("Restarting...");
        initialize_bot();
    });
}

initialize_bot();
