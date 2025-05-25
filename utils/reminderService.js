// utils/reminderService.js

const Task = require("../models/Task");
const User = require("../models/User");
const { sendReminderEmail } = require("./emailSender");

const checkAndSendReminders = async () => {
  const now = new Date(); // Current time: 12:59 PM IST on May 18, 2025
  const reminderTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now: 1:29 PM IST
  const reminderTimeStart = new Date(reminderTime.getTime() - 30 * 1000); // 30 seconds before: 1:28:30 PM IST
  const reminderTimeEnd = new Date(reminderTime.getTime() + 30 * 1000); // 30 seconds after: 1:29:30 PM IST

  try {
    const tasks = await Task.find({
      dueDate: { $gte: reminderTimeStart, $lte: reminderTimeEnd }, // Tasks due between 1:28:30 and 1:29:30 PM IST
      status: "pending",
      reminderSent: false,
    });

    if (tasks.length === 0) {
      console.log("ℹ️ No tasks due exactly 30 minutes from now.");
      return;
    }

    for (const task of tasks) {
      const user = await User.findById(task.userId);
      if (!user) {
        console.log(`⚠️ User not found for task "${task.title}" (ID: ${task._id})`);
        continue;
      }

      const message = `⏰ Reminder: Your task "${task.title}" is due at ${new Date(
        task.dueDate
      ).toLocaleString()}`;
      console.log(
        `📧 Sending reminder email to ${user.email} for task "${task.title}" (Due: ${new Date(
          task.dueDate
        ).toLocaleString()})`
      );

      try {
        await sendReminderEmail(
          user.email,
          "Task Reminder - Your ToDo List App",
          message
        );
        task.reminderSent = true;
        await task.save();
      } catch (emailError) {
        console.error(
          `⚠️ Failed to send reminder email for task "${task.title}" to ${user.email}:`,
          emailError.message
        );
      }
    }
  } catch (error) {
    console.error("Reminder service error:", error.message, error.stack);
  }
};

module.exports = { checkAndSendReminders };