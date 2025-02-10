const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection();

// Chargement des commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON()); // Ajout des données de commande pour Discord
}

// Chargement des événements
const eventsPath = path.join(__dirname, 'events');
const loadEvents = (dir) => {
    const files = fs.readdirSync(path.join(eventsPath, dir)).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const event = require(`./events/${dir}/${file}`);
        const eventName = file.split('.')[0];
        client.on(eventName, event.bind(null, client));
    }
};

// Déploiement des commandes sur l'API Discord
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`🚀 Déploiement de ${commands.length} commandes...`);
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('✅ Commandes enregistrées avec succès.');
    } catch (error) {
        console.error('❌ Erreur lors du déploiement des commandes :', error);
    }
})();

loadEvents('client');
loadEvents('guild');
loadEvents('user');
loadEvents('interaction');

client.login(process.env.DISCORD_TOKEN);
