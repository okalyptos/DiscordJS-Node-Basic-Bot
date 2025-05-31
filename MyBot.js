import { Client, GatewayIntentBits, REST, Routes, ActivityType } from 'discord.js';
import 'dotenv/config'; // Loads environment variables from a .env file
import Ping from './PingCommand.js'; // Import the ping command handler
import commands from './Commands.js';// Imports the array of slash command definitions to be registered with Discord

// Create a new Discord client with specified intents
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,              // Access guild (server) events
        GatewayIntentBits.GuildMessages,       // Access guild message events
        GatewayIntentBits.MessageContent,      // Access message content
        GatewayIntentBits.GuildVoiceStates     // Access voice state updates
    ] 
});

const BOT_TOKEN = process.env.BOT_TOKEN; // Load the bot token from environment variables
const shouldRegisterCommands = process.env.REGISTER_COMMANDS; // Whether to register slash commands

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN); // Setup REST API for command registration

// Fired when the bot is ready and connected
client.once('ready', async () => {
    // Set the bot's presence (custom status message)
    client.user.setPresence({
        activities: [{ name: 'Powered by Node.js', type: ActivityType.Custom }],
        status: 'online',
    });

    console.log(`✅ Bot is online! Logged in as ${client.user.tag}`);

    // Register slash commands if the flag is enabled
    if (shouldRegisterCommands === 'true') {
        try {
            console.log('🔄 Registering slash commands...');

            // Register commands globally
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: commands, // Uses the imported slash command definitions to register them with Discord
            });

            console.log('✅ Slash commands registered successfully!');
        } catch (error) {
            console.error('❌ Failed to register slash commands:', error);
        }
    }
});

// Listen for command interactions
client.on('interactionCreate', async (interaction) => {
    // Ignore non-command interactions and bots
    if (!interaction.isCommand() || interaction.user.bot) return;

    const { commandName } = interaction;
    // Handle commands by name
    switch (commandName) {
        case 'ping':
            Ping(interaction); // Call the ping command handler
            break;
            
        default:
            break;
    }
});

client.login(BOT_TOKEN); // Log the bot in using the provided token
