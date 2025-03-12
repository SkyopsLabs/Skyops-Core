import { Client, GatewayIntentBits } from "discord.js";
import { User } from "../models/User";
import { Discord } from "../models/Discord";

const DISCORD_BOT_TOKEN = process.env.DISCORD_TOKEN!;
const GUILD_ID = process.env.DISCORD_GUILD_ID!; // Your Discord server ID

export const startDiscordBot = async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers, // NEW - Allows fetching members
    ],
  });

  client.once("ready", () => {
    console.log(`🤖 Bot is online as ${client.user?.tag}`);
    console.log(client.ws.status);
  });

  client.on("messageCreate", async (message) => {
    console.log(client.ws.status, "second");
    if (message.author.bot) return; // Ignore bot messages
    if (message.guildId !== GUILD_ID) {
      console.log("wrong server");
      return;
    } // Ensure it's in the right server

    console.log(message);

    await User.updateOne(
      { discord_id: message.author.id },
      {
        $set: {
          lastDiscordMessage: new Date(),
        },
      },
      { upsert: true }
    );

    console.log(`📩 Message received from ${message.author.username}`);
  });

  client.login(DISCORD_BOT_TOKEN);
};
