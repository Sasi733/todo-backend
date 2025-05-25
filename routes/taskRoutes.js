const express = require("express");
const router = express.Router();
const {
  addTask,
  deleteTask,
  getTasksByUser,
  updateTask,
  updateTaskStatus
} = require("../controllers/taskController");

// Routes
router.post("/add", addTask);
router.delete("/delete/:id", deleteTask);
router.get("/user/:userId", getTasksByUser);
router.patch("/update/:id", updateTask);            // 🔄 New: Update task full (title, desc, dueDate)
router.patch("/update-status/:id", updateTaskStatus); // ✅ Keep: Update task status only

module.exports = router;
