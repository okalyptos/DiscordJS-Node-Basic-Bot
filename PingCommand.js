// Define an async function to handle the 'ping' command
async function Ping(interaction) {
    try {
        // Get the bot's WebSocket ping in milliseconds
        const ping = await interaction.client.ws.ping;

        // Send a temporary ephemeral reply to the user with the ping
        const msg = await interaction.reply({
            flags: 1 << 5, // Ephemeral message: only the user can see it
            content: `Ping: **${ping}**ms.`,
        });

        // Delete the message after 3 seconds
        setTimeout(() => msg.delete(), 3000);
    } catch (error) {
        // If there's an error, send a temporary error message
        const msg = await interaction.reply({
            flags: 1 << 6, // Ephemeral message
            content: "Unexpected error",
        });

        // Delete the error message after 3 seconds
        setTimeout(() => msg.delete(), 3000);
    }
}

export default Ping; // Export the function so it can be used in other files
