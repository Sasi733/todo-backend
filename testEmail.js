// testEmail.js

require("dotenv").config();
const { sendReminderEmail } = require("./utils/emailSender");

(async () => {
  try {
    await sendReminderEmail(
      "sasijureddi111@gmail.com", // Send to the same email as FROM_EMAIL for testing
      "🔔 Test Email from Todo App",
      "✅ This is a test message sent using Gmail SMTP."
    );
  } catch (err) {
    console.error("Test email failed:", err.message, err.stack);
  }
})();