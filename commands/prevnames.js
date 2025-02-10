const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prevnames')
        .setDescription("Affiche les anciens pseudos d'un utilisateur")
        .addUserOption(option =>
            option.setName('user')
                .setDescription("L'utilisateur à vérifier")
                .setRequired(true)
        ),
    
    async execute(interaction) {
        const API_URL = process.env.API_URL;
        const user = interaction.options.getUser('user');

        try {
            const response = await axios.get(`${API_URL}/api/prevnames-check/${user.id}`);
            if (response.data.message) {
                await interaction.reply(response.data.message);
            } else {
                const prevnames = response.data;
                const namesList = prevnames.map((nameInfo) => `- ${nameInfo.name} (${nameInfo.date})`).join('\n');
                await interaction.reply(`Les anciens pseudos de ${user.tag} :\n${namesList}`);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des anciens pseudos:', error);
            await interaction.reply('Une erreur est survenue lors de la récupération des anciens pseudos.');
        }
    }
};
