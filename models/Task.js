// models/Task.js

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reminderSent: { type: Boolean, default: false }, // New field to track reminders
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);