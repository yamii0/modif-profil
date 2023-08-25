const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const Profil = require("../../DataBase/Profil.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("give-stats")
    .setDescription("Donner des statistiques à un joueur.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) => 
      option
        .setName("joueur")
        .setDescription("Le joueur auquel il faut donner des statistiques.")
        .setRequired(true)
    ).addStringOption((option) =>
    option
    .setName("statistique")
    .setDescription("La statistique à modifier.")
    .setRequired(true)
    .addChoices(
        { name: "Force", value: "force" },
        { name: "Intelligence", value: "intelligence" },
        { name: "Vitesse", value: "vitesse" },
        { name: "Stats à distribuer", value: "points" },
    )
    )
    .addNumberOption((option) =>
    option
    .setName("quantité")
    .setDescription("Quantité de statistiques à ajouter, supprimer ou remplacer.")
    .setRequired(true)
    
    ),
/**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const joueur = interaction.options.getMember("joueur", true);
        const statistique = interaction.options.getString("statistique", true);
        const quantité = interaction.options.getNumber("quantité", true);

        Profil.findOne({ userID : joueur.user.id }, async (err, data) => {
            if (err) console.log(err);

            if (!data)
            return interaction.reply({
        content: `${joueur} n'a pas de profil !`,
        ephemeral: true
});

const boutons = new ActionRowBuilder()
.addComponents(
    new ButtonBuilder()
    .setCustomId("ajouter")
    .setLabel(`Ajouter ${quantité} à ${statistique}`)
    .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
    .setCustomId("retirer")
    .setLabel(`Retirer ${quantité} à ${statistique}`)
    .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
    .setCustomId("remplacer")
    .setLabel(`Remplacer par ${quantité} en ${statistique}`)
    .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
    .setCustomId("annuler")
    .setLabel(`Annuler`)
);
const réponse = await interaction.reply({
    content: `Quelle type d'opération voulez-vous réaliser ?`,
    components: [boutons],
});

const filtre = (i) => i.user.id === interaction.user.id;

try {
    const confirmation = await réponse.awaitMessageComponent({
        filter: filtre,
        time: 60000,
    });

    if (confirmation.customID === "annuler") {
        confirmation.update({
            content: `Vous avez annuler la commande !`,
            components: [],
        });
    }

    if (confirmation.customID === 'ajouter') {
        if (statistique === 'force') {
            data.statistiques.force = data.statistiques.force + quantité;
        } else if (statistique === 'intelligence') {
            data.statistiques.intelligence = data.statistiques.intelligence + quantité;
        } else if (statistique === 'vitesse') {
            data.statistiques.vitesse = data.statistiques.vitesse + quantité;
        } else if (statistique === 'points') {
            data.statistiques.points = data.statistiques.points + quantité;
        }

        data.save().catch(err => {
            if (err) console.log(err);
        });
        
        await confirmation.update({
            content: `${joueur} à reçu ${quantité} points dans ${statistique}`,
            components: [],
        });
    } else if (confirmation.customID === 'retirer') {
        if (statistique === 'force') {
            if (data.statistiques.force - quantité < 0) data.statistiques.force = 0;
            else data.statistiques.force = data.statistiques.force - quantité;
        } else if (statistique === 'intelligence') {
            if (data.statistiques.intelligence - quantité < 0) data.statistiques.intelligence = 0;
            else data.statistiques.intelligence = data.statistiques.intelligence - quantité;
        } else if (statistique === 'vitesse') {
            if (data.statistiques.vitesse - quantité < 0) data.statistiques.vitesse = 0;
            else data.statistiques.vitesse = data.statistiques.vitesse - quantité;
        } else if (statistique === 'points') {
            if (data.statistiques.points - quantité < 0) data.statistiques.points = 0;
            else data.statistiques.points = data.statistiques.points - quantité;
        }

        data.save().catch(err => {
            if (err) console.log(err);
        });
        
        await confirmation.update({
            content: `${joueur} à perdu ${quantité} points dans ${statistique}`,
            components: [],
        });
    } else if (confirmation.customID === 'remplacer') {
        if (statistique === 'force') {
            data.statistiques.force = quantité;
        } else if (statistique === 'intelligence') {
            data.statistiques.intelligence = quantité;
        } else if (statistique === 'vitesse') {
            data.statistiques.vitesse = quantité;
        } else if (statistique === 'points') {
            data.statistiques.points = quantité;
        }
        
        data.save().catch(err => {
            if (err) console.log(err);
        });

        await confirmation.update({
            content: `${joueur} à désormais ${quantité} points dans ${statistique}`,
            components: [],
        });
    }
} catch (error) {
    interaction.editReply({
        content: `Vous n'avez pas répondu dans le temps imparti de 60 secondes !`,
        components: [],
    });
}
        });
    },
};