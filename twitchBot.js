import tmiJs from "tmi.js";
import "dotenv/config";

const opts = {
  identity: {
    username: "F",
    password: process.env.TWITCH_OAUTH,
  },
  channels: ["F"],
};

const client = new tmiJs.client(opts);

// Register our event handlers (defined below)
// client.on("message", onMessageHandler);
client.on("chat", (channel, userstate, message, self) => {
  console.log(
    `Message "${message}" received from ${userstate["display-name"]}`
  );
  if (self) return;

  client.say(channel, "Test message"); // client.say(channel, msg[1]) // ?
  client.disconnect();
});
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

// client.say(`You are a dummy`);
// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  //   console.log(target);
  if (self) {
    console.log(self);
    return;
  } // Ignore messages from the bot
  //   client.say(target, `You are a dummy`);
  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === "!dice") {
    const num = rollDice();
    client.say(target, `${target.replace("#", "@")} You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else {
    client.say(target, `You are a dummy`);
    console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when the "dice" command is issued
function rollDice() {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
