// utils/taskScheduler.js

const cron = require("node-cron");
const { checkAndSendReminders } = require("./reminderService");

const scheduleTaskReminders = () => {
  cron.schedule("* * * * *", () => {
    console.log("🔄 Checking tasks due exactly 30 minutes from now...");
    checkAndSendReminders();
  });
};

module.exports = { scheduleTaskReminders };