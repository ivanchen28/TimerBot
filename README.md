# TimerBot
A Twitch.tv chat bot that keeps a timer/stopwatch in chat and displays time remaining when promped. Designed for use by twitch.tv/btdisab for Predictions with Channel Points.

Enter bot account details in the .env file, where USERNAME is the name of the account, and PASSWORD is the Oauth password for the account. Then, adjust settings accordingly in server.js.

All uses can type !timer to see time remaining on the timer.
Moderators can start timer with !timer start [time in seconds], add time to the timer with !timer add [time in seconds], and stop the timer with !timer end.
The bot will display a message in chat when the timer ends.
