const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Embed,
} = require("discord.js");

const Profil = require("../../DataBase/Profil.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("demon")
    .setDescription("Interagie avec le pnj demon !")
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

      if (!data) {
        return interaction.reply({ content: `Tu n'es pas un joueur RP !` });
      }

      if (data) {
        const départ = new EmbedBuilder()
          .setTitle("Démon - Boo Dher")
          .setDescription(
            "**Hmmmmm.. Tu oses t'aventurer dans mon domaine.. Être inférieur !**"
          )
          .addFields(
            {name: ` `, value: `**| Option 1 -** *Fuir en courant pour échapper au démon.*`, inline: false,},
            {name: ` `, value: `**| Option 2 -** *Rester face à lui en en le regardant avec insistance.*`, inline: false, },
            {name: ` `, value: `**| Option 3 -** *Poser ta main sur ton manche de sabre au cas où un combat s'engage.*`, inline: false, },
            {name: ` `, value: `**| Option 4 -** *Provoquer le démon d'un ton arrogant et supérieur.*`, inline: false,},
            {name: ` `, value: `**| Option 5 -** *Dégainer ton sabre et lui foncer dessus pour l'attaquer.*`, inline: false,}
          )
          .setColor("Red")
          .setThumbnail(
            "https://i.pinimg.com/originals/5d/77/2c/5d772c6dff9fb4c3dd1a95fa4639a38c.jpg"
          )

          const DépartBoutons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("départ-option1")
            .setLabel("Option 1")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("départ-option2")
            .setLabel("Option 2")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("départ-option3")
            .setLabel("Option 3")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("départ-option4")
            .setLabel("Option 4")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("départ-option5")
            .setLabel("Option 5")
            .setStyle(ButtonStyle.Primary)
          );

          interaction.reply({embeds: [départ], components: [DépartBoutons]});

         const fuite = new EmbedBuilder()
         .setDescription("Tu prends tes jambes à ton coup et tu fuis !");

          if (interaction.customId === "départ-option1") {
            interaction.editReply({embeds: [départ], components: []})
            interaction.channel.send({embeds: [fuite]})
          } else if (interaction.customId === "départ-option2") {
            //
          } else if (interaction.customId === "départ-option3") {
            //
          } else if (interaction.customId === "départ-option4") {
            //
          } else if (interaction.customId === "départ-option5") {
            //
          }
      }
    });
  },
};
