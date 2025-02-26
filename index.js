const axios = require("axios");
const { Tail } = require("tail");

// Discord webhook URL (replace with your own webhook URL)
const discordWebhookUrl =
  "https://discord.com/api/webhooks/1343477271759032361/OCQdzhuzrNjh4DSFI9KHU3SCPVNHEuM6nGf5jHxpf15EZ4fkwmwpI-Un3mOfdKFlpLaK";

// Function to send logs to Discord
function sendLogToDiscord(logMessage) {
  axios
    .post(discordWebhookUrl, {
      content: `\`\`\`${logMessage}\`\`\``, // Sends log as a code block in Discord
    })
    .then((response) => {
      console.log("Log sent to Discord");
    })
    .catch((error) => {
      console.error("Error sending log to Discord:", error);
    });
}

// Start tailing the log file
const tail = new Tail(
  "D:/Office/SparkTechAgency/audio-book-app/AudioBook-Backend/app.log",

  {
    useWatchFile: true, // forces polling instead of relying on fs.watch events
  }
);

// Send new log entries to Discord
// tail.on("line", (data) => {
//   sendLogToDiscord(data);
// });

// Handle errors
tail.on("error", (error) => {
  console.error("Error with tailing log file:", error);
});

// Optionally, you can set a maximum number of log messages to send within a period to avoid flooding Discord
let messageCount = 0;
const maxMessagesPerInterval = 9; // Example: Limit to 10 messages per 10 seconds

setInterval(() => {
  messageCount = 0;
}, 10000); // Reset every 10 seconds

tail.on("line", (data) => {
  if (messageCount < maxMessagesPerInterval) {
    sendLogToDiscord(data);
    messageCount++;
  } else {
    console.log("Rate limit exceeded, skipping log message.----- 😵‍💫");
    console.log(data);
  }
});
