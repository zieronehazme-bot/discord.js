const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const token = 'MTUyMDMwMjI5ODQxNTM2NjMyNA.G4ov-L.3cTwbgM7NU2rQk0OIexmSUmvGG-Voe51IhW5eM';
const clientId = '1520302298415366324'; // From Developer Portal → General Information
const guildId = 'YOUR_SERVER_ID_HERE';       // Optional: put your server ID for instant update

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency'),

  new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Say hello'),

  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('What the bot should say')
        .setRequired(true)),

  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the kick')),

  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the ban')),

  new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout (mute) a member')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to timeout')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('minutes')
        .setDescription('How many minutes')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the timeout')),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Registering slash commands...');

    // Use guild commands for instant update while testing
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    // For global commands (takes up to 1 hour), use this instead:
    // await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log('✅ Slash commands registered successfully!');
  } catch (error) {
    console.error(error);
  }
})();
