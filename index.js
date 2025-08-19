const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
  partials: ['CHANNEL']
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'dm') {
    const targetUser = interaction.options.getUser('user');
    const messageContent = interaction.options.getString('message');
    const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL);

    // DM Embed
    const dmEmbed = new EmbedBuilder()
      .setColor('#2b6cb0') // blue left border
      .setDescription(messageContent);

    try {
      await targetUser.send({ embeds: [dmEmbed] });

      // Log Embed
      const logEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('📩 DM Sent')
        .addFields(
          { name: 'Sent By', value: `${interaction.user.tag}`, inline: true },
          { name: 'To', value: `${targetUser.tag}`, inline: true },
          { name: 'Message', value: messageContent }
        )
        .setTimestamp();

      await logChannel.send({ embeds: [logEmbed] });

      await interaction.reply({ content: `✅ DM sent to **${targetUser.tag}**`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: `❌ Could not send DM to **${targetUser.tag}**.`, ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
