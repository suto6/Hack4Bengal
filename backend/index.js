const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  const msg = req.body.Body;
  const from = req.body.From;

  // Logic to reply to WhatsApp message
  res.send(`<Response><Message>Hello! You said: ${msg}</Message></Response>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
