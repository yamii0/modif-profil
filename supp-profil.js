const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client } = require("discord.js");

const Profil = require("../../DataBase/Profil.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("supp-profil")
    .setDescription("Supprimer un profil")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) => 
      option
        .setName("joueur")
        .setDescription("Le profil à supprimer.")
        .setRequired(true)
    ),
/**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        // 1144633691247755354

        const joueur = interaction.options.getMember("joueur", true);

        if (!interaction.member.roles.cache.has("1144633691247755354")) {
            return interaction.reply({
                content: `${joueur} lâche ça garçon.`, ephemeral: true,
            });
        }

        Profil.findOne({ userID: joueur.user.id }, async (err, data) => {
            if (err) console.log(err);

            if (!data)
              return interaction.reply({
               content: `${joueur} n'a pas de profil !`, 
               ephemeral: true,
             });

             try {
                Profil.deleteOne({ userID: joueur.user.id }, async (err) => {
                    if (err) console.log(err);
                 }).then((deletedProfil) => {
                    interaction.reply({
                        content: `Le profil de ${joueur} a bien été supprimé !`,
                        ephemeral: true,
                    })
                 })
             } catch (error) {
                return interaction.reply({
                    content: ` la commande n'a pas fonctionné, surement du à un problème, veuillez réessayer ou avertir le responsable du bot !`,
                    ephemeral: true,
                });
             }
        });
    },
};