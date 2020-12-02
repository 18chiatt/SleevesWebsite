const fs = require("fs")
const mongoose = require('mongoose');
const express = require("express");
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/sleeves', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const SECRET_PASSWORD = fs.readFileSync("password.txt");
const maxToReturn = 20;

const gameSchema = new mongoose.Schema({
  name: String,
  sizes: [Object]
});

const sleeveScheme = new mongoose.Schema({
  SKU: Number,
  width: Number,
  height: Number,
  price: String,
  link: String,
  name: String,
});

const suggestionScheme = new mongoose.Schema({
  name: String,
  sizes: [Object],
  suggestedBy: String,
  timeStamp: Number,
  ipAddress: String,
})




const Suggestion = mongoose.model("Suggestions", suggestionScheme);

const Sleeve = mongoose.model("Sleeve", sleeveScheme);

const Game = mongoose.model("Game", gameSchema);

const db = mongoose.connection;

updateDatabase();




app.get("/Games/:query", async (req, res) => {
  console.log(req.ip);
  console.log(typeof(req.ip));
  var query = req.params.query;

  let games = await Game.find({
    name: {
      $regex: query
    }
  }).limit(maxToReturn);
  res.send(JSON.stringify(games));
});

app.get("/Sleeves", async (req, res) => {

  let games = await Game.find();
  res.send(games);
});

app.post("/Suggest", async (req, res) => {
  console.log(req.ip);
  console.log(req.body);
  let request = req.body;
  if (!request.name || !request.suggestedBy || !request.sizes) {
    res.status(400);
    res.json({
      message: "Incomplete request"
    });
    return;
  }
  request.ipAddress = req.ip;
  request.timeStamp = Math.round(Date.now() / 1000);
  let newSuggestion = new Suggestion(request);
  await newSuggestion.save();
  let toRespond = await Suggestion.find({
    _id: newSuggestion._id
  });
  res.send(toRespond);

});


app.put("/Manage", async (req, res) => {
  let requestBody = req.body;
  if (!requestBody.password || !requestBody.id || !requestBody.approve) {
    res.status(400);
    res.json({
      message: "Incomplete request"
    });
  }
  if (requestBody.password != SECRET_PASSWORD) {
    res.status(400);
    res.json({
      message: "Incorrect password"
    });
  }
  if (requestBody.approve == false) {
    let response = await Suggestion.deleteOne({
      _id: requestBody.id
    });
    console.log(response);
    console.log("Finish me, return positive resopnse!");
    res.send({
      message: "Success!"
    });
  } else {
    let query = await Suggestion.findById(requestBody.id);
    let toPush = new Game(query);
    toPush.save();
    console.log("Approved game suggested by " + query.suggestedBy);
    console.log("Approval took " + (Date.now() / 1000 - query.timeStamp) / 86400 + " days");
    res.send(toPush);
  }
})









app.listen(3000, () =>
  console.log(`Sleeve API listening on port 3000!`),
);


function getGames() {
  let rawJSON = fs.readFileSync("Games.json");
  let obj = JSON.parse(rawJSON);
  let games = obj["data"]


  let sleevesMap = getSleevesMap()
  let unknownSize = {
    SKU: "???",
    width: "???",
    height: "???",
    price: "???",
    link: "???",
    name: "???",
  }

  let finishedGames = [];
  for (var game of Object.entries(games)) {
    game = game[1];
    //console.log(game);
    let newGame = {
      name: game.name,
      sizes: [],
    };
    for (let size of game.theSizes) {
      let currCount = {
        count: size.count
      }
      if (sleevesMap.get(size.size)) {
        let toPush = JSON.parse(JSON.stringify(sleevesMap.get(size.size)))
        toPush.count = size.count

        newGame.sizes.push(toPush)
      } else {
        let toPush = JSON.parse(JSON.stringify(unknownSize))
        toPush.count = size.count
        newGame.sizes.push(toPush);
      }
    }
    finishedGames.push(newGame);
  }
  return finishedGames
}

function getSleevesMap() {
  let sleevesInfoJSON = fs.readFileSync("Sleeves.json")
  let obj2 = JSON.parse(sleevesInfoJSON);
  let sleeves = obj2["data"];
  let sleevesMap = new Map(Object.entries(sleeves));
  return sleevesMap
}

function getSleevesArray() {
  let map = getSleevesMap();
  let sleeves = [];
  for (let ele of map.values()) {
    sleeves.push(ele);

  }
  console.log(sleeves);
  return sleeves;
}

function updateDatabase() {
  let needsUpdate = JSON.parse(fs.readFileSync("update.txt"));
  if (needsUpdate.games != false) {
    console.log("Updating games!");
    let games = getGames();
    for (let game of games) {
      const currGame = new Game({
        name: game.name,
        sizes: game.sizes
      });
      currGame.save();

    }
    console.log("Finished!");

  } else {
    console.log("No need to update games!")
  }

  if (needsUpdate.sleeves != false) {
    console.log("Updating sleeves!");
    let sleeves = getSleevesArray();
    for (let sleeve of sleeves) {
      const currSleeve = new Sleeve(sleeve);
      currSleeve.save();
    }
    Sleeve.find().limit(4).then((out) => {
      console.log(out);
    })

  } else {
    console.log("not updating sleeves!");
  }
}