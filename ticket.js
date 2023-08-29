const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const Ticket = require("../../DataBase/Ticket.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Commande pour se créer un ticket !")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {

    Ticket.findOne({ userID: interaction.user.id }, async (err, data) => {
      if (err) console.log(err);

      /*if (interaction.guild.channels.cache.find(channel => channel.name === `ticket-${interaction.user.username}`)) {
        return interaction.reply({
          content: `Tu as déjà un ticket d'ouvert !`,
          ephemeral: true,
        });
      }*/

      if (data) {
         return interaction.reply({
          content: `${interaction.member}, tu as déjà un ticket ouvert !`,
          ephemeral: true,
        })
      };
  
      const ChannelType = interaction.guild.channels;
  
    const newChannel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      topic: `${interaction.user.id}`,
      type: ChannelType.GuildText,
      parent: "1145629692095905852",
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: "1144633691247755354",
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });

    const newTicket = new Ticket({
      userID: interaction.user.id,
      ticket: `${newChannel.id}`
    });

    newTicket.save().catch((err) => {
      if (err) console.log(err);
    });
  
    interaction.reply({
      content: `Tu viens de créer ton ticket ! ${newChannel}`,
      ephemeral: true,
  });
  
  const boutonClose = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId("ticket-close")
    .setLabel("Fermer le ticket !")
    .setStyle(ButtonStyle.Primary)
  )
      const closeTicket = await newChannel.send({content: `Fermer le ticket`, components: [boutonClose]})
  
      if (closeTicket.CustomId === "ticket-close") {
        interaction.guild.channels.delete((channel) => channel.id === `${data.ticket}`);
      
      }

    });
  }
};
