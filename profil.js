const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const Profil = require("../../DataBase/Profil.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profil")
    .setDescription("Voici votre profil !")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    Profil.findOne({ userID: interaction.user.id }, async (err, data) => {
      if (err) console.log(err);

      if (!data)
        return interaction.reply({
          content: `Vous n'avez pas encore de personnage !`,
        });

      const boutonProfil = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("stats")
          .setLabel(`Stats`)
          .setStyle(ButtonStyle.Danger)
      );

      const embedProfil = new EmbedBuilder()
        .setDescription(`# Profil de ${interaction.member} : #`)
        .setImage(data.apparence)
        .addFields(
          { name: "**Nom :**", value: `\`${data.nom}\``, inline: true },
          { name: "**Âge :**", value: `\`${data.age}\``, inline: true }
        )
        .setColor("Aqua");

      const boutonStats = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("profil")
          .setLabel(`Profil`)
          .setStyle(ButtonStyle.Danger)
      );

      const embedStats = new EmbedBuilder()
        .setDescription(`# Statistiques de ${interaction.member} : #`)
        .setImage(data.apparence)
        .addFields(
          {
            name: "**Force :**",
            value: `\`${data.statistiques.force}\``,
            inline: true
          },
          {
            name: "**Intelligence :**",
            value: `\`${data.statistiques.intelligence}\``,
            inline: true
          },
          {
            name: "**Vitesse :**",
            value: `\`${data.statistiques.vitesse}\``,
            inline: true
          },
          {
            name: "**Points à répartir :**",
            value: `\`${data.statistiques.points}\``,
            inline: true
          }
        )
        .setColor("Aqua");

      const réponse = await interaction.reply({
        embeds: [embedProfil],
        components: [boutonProfil],
      });

      const filtre = (i) => i.user.id === interaction.user.id;

      const confirmation = await réponse.awaitMessageComponent({
        filter: filtre,
        time: 60000,
      });

      if (confirmation.customId === "stats") {
        confirmation.update({
          embeds: [embedStats],
          components: [boutonStats],
        });
      }

      if (confirmation.customId === "profil") {
        interaction.editReply({
          embeds: [embedProfil],
          components: [boutonProfil],
        });
      }
    });
  },
};
