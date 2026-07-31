onst {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionFlagsBits,
  Partials
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,      // needed for welcome + moderation
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.GuildMember]
});

// ========== READY ==========
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ========== WELCOME MESSAGE ==========
client.on('guildMemberAdd', async (member) => {
  // Change this to the channel name or ID you want
  const welcomeChannel = member.guild.channels.cache.find(
    ch => ch.name === 'welcome' || ch.name === 'general'
  );

  if (!welcomeChannel) return;

  const embed = new EmbedBuilder()
    .setTitle('Welcome!')
    .setDescription(`Hey ${member}, welcome to **${member.guild.name}**! 🎉`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setColor(0x57F287)
    .setTimestamp()
    .setFooter({ text: `Member #${member.guild.memberCount}` });

  welcomeChannel.send({ embeds: [embed] });
});

// ========== SLASH COMMANDS ==========
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options, member, guild } = interaction;

  // /ping
  if (commandName === 'ping') {
    const latency = Date.now() - interaction.createdTimestamp;
    await interaction.reply(`Pong! 🏓 Latency: **${latency}ms**`);
  }

  // /hello
  if (commandName === 'hello') {
    await interaction.reply(`Hey ${interaction.user.username}! 👋 How’s it going?`);
  }

  // /say
  if (commandName === 'say') {
    const message = options.getString('message');
    await interaction.reply({ content: message, ephemeral: false });
  }

  // /kick
  if (commandName === 'kick') {
    if (!member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({ content: '❌ You need **Kick Members** permission.', ephemeral: true });
    }

    const user = options.getUser('user');
    const reason = options.getString('reason') || 'No reason provided';
    const target = await guild.members.fetch(user.id).catch(() => null);

    if (!target) return interaction.reply({ content: 'User not found.', ephemeral: true });
    if (!target.kickable) return interaction.reply({ content: 'I cannot kick this user.', ephemeral: true });

    await target.kick(reason);
    await interaction.reply(`✅ **${user.tag}** has been kicked.\nReason: ${reason}`);
  }

  // /ban
  if (commandName === 'ban') {
    if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: '❌ You need **Ban Members** permission.', ephemeral: true });
    }

    const user = options.getUser('user');
    const reason = options.getString('reason') || 'No reason provided';
    const target = await guild.members.fetch(user.id).catch(() => null);

    if (target && !target.bannable) {
      return interaction.reply({ content: 'I cannot ban this user.', ephemeral: true });
    }

    await guild.members.ban(user.id, { reason });
    await interaction.reply(`✅ **${user.tag}** has been banned.\nReason: ${reason}`);
  }

  // /timeout
  if (commandName === 'timeout') {
    if (!member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: '❌ You need **Timeout Members** permission.', ephemeral: true });
    }

    const user = options.getUser('user');
    const minutes = options.getInteger('minutes');
    const reason = options.getString('reason') || 'No reason provided';
    const target = await guild.members.fetch(user.id).catch(() => null);

    if (!target) return interaction.reply({ content: 'User not found.', ephemeral: true });
    if (!target.moderatable) return interaction.reply({ content: 'I cannot timeout this user.', ephemeral: true });

    const duration = minutes * 60 * 1000; // convert to milliseconds
    await target.timeout(duration, reason);
    await interaction.reply(`✅ **${user.tag}** has been timed out for **${minutes} minutes**.\nReason: ${reason}`);
  }
});

// ========== LOGIN ==========
client.login('MTUzMjY3OTYxMjgwOTc0MDM1OA.GUTav2.Jvnd99bjgPsGsiOvHwKoof80gZOIgsNVWeAOlk');
