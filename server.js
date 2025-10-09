
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const dataFile = path.join(__dirname, "data.json");

app.post("/submit", (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const text = req.body.message;
  const entry = { ip, text, date: new Date().toISOString() };

  let messages = [];
  if (fs.existsSync(dataFile)) {
    messages = JSON.parse(fs.readFileSync(dataFile));
  }
  messages.push(entry);
  fs.writeFileSync(dataFile, JSON.stringify(messages, null, 2));

  res.redirect("/show.html");
});

app.get("/messages", (req, res) => {
  if (fs.existsSync(dataFile)) {
    const messages = JSON.parse(fs.readFileSync(dataFile));
    res.json(messages);
  } else {
    res.json([]);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
