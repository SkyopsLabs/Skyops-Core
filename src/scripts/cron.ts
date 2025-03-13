import { User } from "../models/User";
import cron from "node-cron";

/**
 * Cron job to reset claimed fields at midnight (or every 3 hours in test mode)
 * @param {boolean} testMode - If true, runs every 3 hours; otherwise, runs at midnight
 * @returns {Object} - Scheduled cron job task
 */
export const initializeClaimedFieldsReset = (testMode = false) => {
  const cronSchedule = testMode ? "0 */3 * * *" : "0 0 * * *";

  const task1 = cron.schedule(cronSchedule, async () => {
    try {
      // Reset all users' claimed fields
      const result = await User.updateMany(
        {},
        { $set: { claimedDiscord: false, claimedTelegram: false } }
      );

      console.log(
        `[${new Date().toISOString()}] Reset claimed fields for ${
          result.modifiedCount ?? 0
        } users`
      );
    } catch (error) {
      console.error("Error resetting claimed fields:", error);
    }
  });

  console.log(
    `Claimed fields reset initialized in ${
      testMode
        ? "TEST MODE (every 3 hours)"
        : "PRODUCTION MODE (midnight daily)"
    }`
  );

  const task2 = cron.schedule("*/15 * * * *", async () => {
    try {
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));

      // Find users who have sent at least one Discord message today and haven't claimed
      const discordUsers = await User.find({
        lastDiscordMessage: { $gte: startOfDay, $lte: endOfDay },
        claimedDiscord: false,
      });

      // Find users who have sent at least one Telegram message today and haven't claimed
      const telegramUsers = await User.find({
        lastTelegramMessage: { $gte: startOfDay, $lte: endOfDay },
        claimedTelegram: false,
      });

      // Update Discord users
      for (const user of discordUsers) {
        await User.updateOne(
          { _id: user._id },
          { $inc: { points: 10 }, $set: { claimedDiscord: true } }
        );
      }

      // Update Telegram users
      for (const user of telegramUsers) {
        await User.updateOne(
          { _id: user._id },
          { $inc: { points: 10 }, $set: { claimedTelegram: true } }
        );
      }

      console.log(
        `[${new Date().toISOString()}] Updated ${
          discordUsers.length
        } Discord users & ${telegramUsers.length} Telegram users`
      );
    } catch (error) {
      console.error("Error updating user activity points:", error);
    }
  });

  console.log("User activity check initialized (every 15 minutes)");

  return { task1, task2 };
};

/**
 * Cron job to reward users who have sent messages in Discord/Telegram within the day
 * Runs every 15 minutes
 */
