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
                
                // Si le nombre de pseudos dépasse 15, on gère la pagination
                const namesPerPage = 15;
                const pages = Math.ceil(prevnames.length / namesPerPage);

                // Fonction pour créer l'embed avec les pseudos pour une page donnée
                const createEmbed = (page) => {
                    const start = (page - 1) * namesPerPage;
                    const end = start + namesPerPage;
                    const namesList = prevnames.slice(start, end).map((nameInfo) => `- ${nameInfo.name} (${nameInfo.date})`).join('\n');
                    
                    return {
                        embeds: [{
                            title: `Pseudos de ${user.tag} (Page ${page}/${pages})`,
                            description: namesList,
                            color: 0x00AE86,
                        }],
                    };
                };

                const initialEmbed = createEmbed(1);
                const message = await interaction.reply({
                    ...initialEmbed,
                    fetchReply: true,
                });

                if (pages > 1) {
                    await message.edit({
                        ...initialEmbed,
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        style: 1,
                                        label: 'Précédent',
                                        customId: 'prevnames_prev',
                                        disabled: true,  // Initialement désactivé
                                    },
                                    {
                                        type: 2,
                                        style: 1,
                                        label: 'Suivant',
                                        customId: 'prevnames_next',
                                    },
                                ],
                            },
                        ],
                    });

                    let currentPage = 1;

                    // Gestion des interactions avec les boutons
                    const filter = (interaction) => interaction.user.id === interaction.user.id;
                    const collector = message.createMessageComponentCollector({ filter, time: 60000 });

                    collector.on('collect', async (btnInteraction) => {
                        if (btnInteraction.customId === 'prevnames_prev' && currentPage > 1) {
                            currentPage--;
                        } else if (btnInteraction.customId === 'prevnames_next' && currentPage < pages) {
                            currentPage++;
                        }

                        await btnInteraction.update({
                            ...createEmbed(currentPage),
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            style: 1,
                                            label: 'Précédent',
                                            customId: 'prevnames_prev',
                                            disabled: currentPage === 1,  // Désactiver si on est à la première page
                                        },
                                        {
                                            type: 2,
                                            style: 1,
                                            label: 'Suivant',
                                            customId: 'prevnames_next',
                                            disabled: currentPage === pages,  // Désactiver si on est à la dernière page
                                        },
                                    ],
                                },
                            ],
                        });
                    });

                    collector.on('end', () => {
                        message.edit({
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            style: 1,
                                            label: 'Précédent',
                                            customId: 'prevnames_prev',
                                            disabled: true,
                                        },
                                        {
                                            type: 2,
                                            style: 1,
                                            label: 'Suivant',
                                            customId: 'prevnames_next',
                                            disabled: true,
                                        },
                                    ],
                                },
                            ],
                        });
                    });
                }
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des anciens pseudos:', error);
            await interaction.reply('Une erreur est survenue lors de la récupération des anciens pseudos.');
        }
    }
};
