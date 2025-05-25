// controllers/taskController.js

const Task = require("../models/Task");

// Add a new task
const addTask = async (req, res) => {
  try {
    console.log("🔍 Incoming Task Payload:", req.body); // Debug log

    const { title, description, dueDate, userId } = req.body;

    if (!title || !dueDate || !userId) {
      return res.status(400).json({ message: "Missing required fields: title, dueDate, or userId" });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      userId,
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("❌ Error creating task:", error.message, error.stack);
    res.status(500).json({ message: "Failed to create task", error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message, error.stack);
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
};

// Get all tasks for a specific user
const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const tasks = await Task.find({ userId }).sort({ dueDate: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message, error.stack);
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task status updated", task: updated });
  } catch (error) {
    console.error("Error updating status:", error.message, error.stack);
    res.status(500).json({ message: "Failed to update task status", error: error.message });
  }
};

// Update task details
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: "Title and dueDate are required" });
    }

    const updated = await Task.findByIdAndUpdate(
      id,
      { title, description, dueDate, reminderSent: false }, // Reset reminderSent when task is updated
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", task: updated });
  } catch (error) {
    console.error("Error updating task:", error.message, error.stack);
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
};

module.exports = {
  addTask,
  deleteTask,
  getTasksByUser,
  updateTaskStatus,
  updateTask,
};