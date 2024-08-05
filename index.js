const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

const accountSid = 'insert SID here ';
const authToken = 'key here';
const client = new twilio(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));

let itinerary = {};

app.post('/webhook', (req, res) => {
  const incomingMsg = req.body.Body.toLowerCase();
  const from = req.body.From;

  let responseMsg = '';

  if (incomingMsg.includes('start')) {
    itinerary[from] = {};
    responseMsg = 'Welcome to the Itinerary Planner! Please provide your travel destination.';
  } else if (!itinerary[from].destination) {
    itinerary[from].destination = incomingMsg;
    responseMsg = `Got it! You're traveling to ${incomingMsg}. When are you planning to go?`;
  } else if (!itinerary[from].date) {
    itinerary[from].date = incomingMsg;
    responseMsg = `Great! You're traveling on ${incomingMsg}. How many people are traveling?`;
  } else if (!itinerary[from].people) {
    itinerary[from].people = incomingMsg;
    responseMsg = `Understood. ${incomingMsg} people. Any specific places you want to visit?`;
  } else if (!itinerary[from].places) {
    itinerary[from].places = incomingMsg;
    responseMsg = `Noted. You want to visit: ${incomingMsg}. Your itinerary is being prepared!`;
  } else {
    responseMsg = `Here's your itinerary:\nDestination: ${itinerary[from].destination}\nDate: ${itinerary[from].date}\nPeople: ${itinerary[from].people}\nPlaces: ${itinerary[from].places}\n\nThank you for using the Itinerary Planner!`;
    itinerary[from] = {}; // Reset for the next itinerary
  }

  client.messages
    .create({
      body: responseMsg,
      from: 'whatsapp:+14155238886', // Twilio sandbox number
      to: from
    })
    .then(message => console.log(message.sid))
    .done();

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
