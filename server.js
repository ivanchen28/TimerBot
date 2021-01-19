const express = require('express')
const tmi = require('tmi.js');
const app = express()
app.get("/", (request, response) => {
  response.sendStatus(200)
})
app.listen(process.env.PORT)

var timerCooldown = false;
var helpCooldown = false;
var endCooldown = false;
var init = false;

/*
const client = new tmi.Client({
	options: { debug: true, messagesLogLevel: "info" },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: process.env.USERNAME,
		password: process.env.PASSWORD
	},
	channels: [ 'btdsab' ]
});
client.connect().catch(console.error);
client.on('message', (channel, tags, message, self) => {
	if(self) return;
	if(message.toLowerCase() === '!hello') {
		client.say(channel, `@${tags.username}, heya!`);
	}
}); */
const fs = require('fs');
const opts = {
  identity: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  },
  channels: [
    'btdisab'
  ]
};
const client = new tmi.client(opts);

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.connect();

function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

// starts timer
var timeRemaining = 0; // in seconds
function startTimer(target, time) {
  // if (timeRemaining != 0) timeRemaining = 0;
  timeRemaining = time;
  decreaseTimer(target);
}

function decreaseTimer(target) {
  if (timeRemaining > 0) {
    setTimeout(function () {
      decreaseTimer(target);
      timeRemaining--;
    }, 1000);
  }
  else {
    if (!endCooldown) {
      for (var i = 0; i < 1; i++) client.say(target, 'Timer ended!');
      endCooldown = true;
      setTimeout(function () {
        endCooldown = false;
      }, 3000);
    }
  }
}

// handles sent message
function onMessageHandler(target, context, msg, self) {
  if (self) return;
  const commandName = msg.trim(); // Remove whitespace from chat message
  var isAdmin = false;
  if (context.mod || context.username == "btdisab") isAdmin = true;
  if (!init) {
    // client.say(target, 'ISAB Timer Bot initialized.');
    init = true;
  }
  
  if (commandName.substring(0, 12) ===  '!timer start' && isAdmin) {
    // starting timer
    if (!(isNaN(commandName.substring(12))) && commandName.substring(12) > 0) {
      var timeStart = commandName.substring(12);
      startTimer(target, timeStart);
      client.say(target, '@' + context['display-name'] + ' Timer started for ' + timeRemaining + ' seconds.');
    }
    else client.say(target, '@' + context['display-name'] + ' Please enter a positive number of seconds.');
  }
  else if (commandName.substring(0, 10) ===  '!timer add' && isAdmin) {
    // adding to timer
    if (timeRemaining > 0) {
      if (!(isNaN(commandName.substring(10))) && commandName.substring(10) > 0) {
        var timeAdd = commandName.substring(10);
        timeRemaining = +timeAdd + +timeRemaining;
        if (timeAdd > 1) client.say(target, '@' + context['display-name'] + ' ' + timeAdd + ' seconds added to the timer.');
        else client.say(target, '@' + context['display-name'] + ' 1 second added to the timer.');
      }
      else client.say(target, '@' + context['display-name'] + ' Please enter a positive number of seconds.');
    }
    else client.say(target, '@' + context['display-name'] + ' There is no timer active.');
  }
  else if (commandName.substring(0, 10) ===  '!timer end' && isAdmin) {
    // starting timer
    if (timeRemaining > 0) {
      if (timeRemaining > 1) client.say(target, '@' + context['display-name'] + ' ' + ' timer ended with ' + timeRemaining + ' seconds remaining');
      else client.say(target, '@' + context['display-name'] + ' ' + ' timer ended with 1 second remaining.');
      endCooldown = true;
      setTimeout(function () {
        endCooldown = false;
      }, 3000);
      timeRemaining = 0;
    }
    else client.say(target, '@' + context['display-name'] + ' There is no timer active.');
  }
  else if (commandName.substring(0, 6) === '!timer') {
    // timer
    if (!timerCooldown) {
      if (timeRemaining > 0) {
        var minute = Math.floor(timeRemaining/60);
        var second = timeRemaining % 60;
        var m = ' minutes ';
        var s = ' seconds.';
        if (minute == 1) m = ' minute ';
        if (second == 1) s = ' second.';
        client.say(target, 'Time remaining: ' + minute + m + second + s);
      }
      else client.say(target, 'There is no timer active.');

      timerCooldown = true;
      setTimeout(function () {
        timerCooldown = false;
      }, 3000);
    }
  }
}
console.log("Started")