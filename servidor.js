const express = require("express");
const fs = require("fs");
const server = express();
const dayjs = require("dayjs");
const cors = require("cors");
const stripHtml = require("string-strip-html");

server.use(express.json());
server.use(cors());

let participants = [];
let messages = [];

if (fs.existsSync("data/participants.json"))
  participants = JSON.parse(fs.readFileSync("data/participants.json"));
if (fs.existsSync("data/messages.json"))
  messages = JSON.parse(fs.readFileSync("data/messages.json"));

//--------Remove Inactive Participant--------------

setInterval(() => {
  let maxTime = 10000;
  if (participants.length === 0 || undefined || null) return;
  participants = participants.filter(
    (p) => maxTime > Date.now() - p.lastStatus
  );
  fs.writeFileSync("participants.json", JSON.stringify(participants));
}, 15000);

//------------------Server Routes------------------

server.get("/participants", (req, res) => {
  res.send(participants);
});

//-------------------------------------------------

server.post("/participants", (req, res) => {
  let { name } = req.body;
  let nameAlreadyInUse = false;
  name = stripHtml(name).result;

  nameAlreadyInUse = participants.some((p) => p.name === name);

  if (name.length === 0 || undefined || null) return res.sendStatus(400);

  //---This Server Does Not Allow The Same Username For The Sake Of Convenience---
  if (nameAlreadyInUse) return res.status(400).send("Nome indisponível!");

  let newParticipant = {
    name: name,
    lastStatus: Date.now(),
  };

  let newMessage = {
    from: name,
    to: "Todos",
    text: "entra na sala...",
    type: "status",
    time: dayjs().format("HH:mm:ss"),
  };

  participants.push(newParticipant);
  messages.push(newMessage);
  fs.writeFileSync("data/participants.json", JSON.stringify(participants));
  fs.writeFileSync("data/messages.json", JSON.stringify(messages));
  res.sendStatus(200);
});

//-------------------------------------------------

server.get("/messages", (req, res) => {
  let username = req.headers["user-name"];
  let FilteredMessages = messages.slice(-100).filter((m) => {
    if (m.type === "private_message") {
      return username === m.from || username === m.to;
    } else return true;
  });
  res.send(FilteredMessages);
});

//-------------------------------------------------

server.post("/messages", (req, res) => {
  let { from, to, text, type } = req.body;
  let participantExists = false;
  from = stripHtml(from).result;
  to = stripHtml(to).result;
  text = stripHtml(text).result;
  type = stripHtml(type).result;

  if (to !== "Todos")
    participantExists = participants.some((p) => p.name === to);

  if (from.length === 0 || undefined || null) return res.sendStatus(400);
  if (to.length === 0 || undefined || (null && !participantExists))
    return res.sendStatus(400);
  if (text.length === 0 || undefined || null) return res.sendStatus(400);
  if (type !== "message" && type !== "private_message")
    return res.sendStatus(400);

  let newMessage = {
    from,
    to,
    text,
    type,
    time: dayjs().format("HH:mm:ss"),
  };

  messages.push(newMessage);
  fs.writeFileSync("data/messages.json", JSON.stringify(messages));
  res.sendStatus(200);
});

//-------------------------------------------------

server.post("/status", (req, res) => {
  let { name } = req.body;
  let participantExists = false;
  name = stripHtml(name).result;

  participantExists = participants.some((p) => p.name === name);
  if (!participantExists) return res.sendStatus(400);

  for (let i = 0; i < participants.length; i++) {
    if (participants[i].name === name) {
      participants[i].lastStatus = Date.now();
      break;
    }
  }
  fs.writeFileSync("data/participants.json", JSON.stringify(participants));
  res.sendStatus(200);
});

//-------------------------------------------------

server.listen(3000);
