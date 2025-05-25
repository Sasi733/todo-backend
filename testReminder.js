// testReminder.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("./models/User");
const Task = require("./models/Task");
const { checkAndSendReminders } = require("./utils/reminderService");

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for testing");

    // Step 1: Register a new user
    const username = "testuser123";
    const email = "testuser123@gmail.com";
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      await User.deleteOne({ username });
    }

    const hashedPassword = await bcrypt.hash("password123", 10);
    const newUser = new User({
      name: "Test User",
      age: 25,
      phone: "9876543210",
      profession: "Tester",
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();
    console.log(`User ${username} registered at ${newUser.createdAt}`);

    // Step 2: Create a task for the user
    const dueDate = new Date("2025-05-18T14:00:00.000+05:30"); // 2:00 PM IST on May 18, 2025
    const task = new Task({
      title: "Test Task",
      description: "This is a test task",
      dueDate,
      userId: newUser._id,
      status: "pending",
      reminderSent: false,
    });
    await task.save();
    console.log(`Task created with due date ${dueDate}`);

    // Step 3: Simulate time for reminder (30 minutes before due date)
    // Due date: 2:00 PM IST, so reminder should trigger at 1:30 PM IST
    // Current time: 12:59 PM IST, so we need to adjust the test
    console.log("Adjusting system time for testing is not possible, so manually trigger reminder...");
    console.log(
      "Run this test when the current time is exactly 30 minutes before the task due date (e.g., 1:30 PM IST for a 2:00 PM IST due date)."
    );

    // Step 4: Trigger the reminder manually
    await checkAndSendReminders();

    // Step 5: Clean up
    await Task.deleteOne({ _id: task._id });
    await User.deleteOne({ _id: newUser._id });
    await mongoose.connection.close();
    console.log("Test completed and database connection closed.");
  } catch (error) {
    console.error("Test failed:", error.message, error.stack);
    await mongoose.connection.close();
  }
})();