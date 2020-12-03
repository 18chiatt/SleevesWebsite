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


const SECRET_PASSWORD = String(fs.readFileSync("password.txt"));


const maxToReturn = 5;

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
  comment: String,
  suggestedBy: String,
  timeStamp: Number,
  ipAddress: String,
})

const ipBanSchema = new mongoose.Schema({
  ip: String,
})




const Suggestion = mongoose.model("Suggestions", suggestionScheme);

const Sleeve = mongoose.model("Sleeve", sleeveScheme);

const Game = mongoose.model("Game", gameSchema);

const Ban = mongoose.model("Ban", ipBanSchema);

const db = mongoose.connection;

if (process.argv.includes("-b")) {
  rebuild();
} else {
  console.log("Going with existing database!")
  ensureCorrectness();
}



if (process.argv.includes("u")) {
  console.log("unbanning all users!");
  Ban.deleteMany({})
} else {
  console.log("Leaving bans in place");
}

if (SECRET_PASSWORD.length < 3) {
  console.log("Unable to fetch password from password.txt");
  process.exit();
}

async function rebuild() {
  console.log("Rebuilding! -- clearing")
  await clearDB();
  console.log("CLeared!")
  await updateDatabase();
  console.log("Re-created!");

}

async function ensureCorrectness() {
  let numGames = await Game.count();
  let numSleeves = await Sleeve.count();
  if (numGames < 4 || numSleeves < 4) {
    console.log("ERROR Database not working");
    process.exit();
  } else {
    console.log("Database working, Games: " + numGames + " and Sleeves: " + numSleeves);
  }

}


app.get("/api/Games/:query", async (req, res) => {


  var query = req.params.query;
  query = decodeURI(query);
  query = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  console.log("Got query for " + query);

  let games = await Game.find({
    name: {
      $regex: query,
      $options: 'i'
    }
  }).limit(maxToReturn);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(JSON.stringify(games));
});

app.get("/api/Sleeves", async (req, res) => {

  let games = await Sleeve.find();
  res.send(games);
});

app.post("/api/Suggest", async (req, res) => {
  console.log("Got request for suggest!");


  let request = req.body;
  console.log(request);
  if (!request.suggestedBy || !request.comment) {
    res.status(400);
    res.json({
      message: "Incomplete request"
    });
    return;
  }
  request.ipAddress = req.ip;
  request.timeStamp = new Date() / 1000;

  let banned = await Ban.exists({
    ip: request.ipAddress
  });
  if (banned) {
    res.json({
      message: "You have been banned from the service"
    });
    return;
  }
  let newSuggestion = new Suggestion(request);
  console.log(request);
  await newSuggestion.save();
  res.send({
    message: "Success! Thank you for your submission!"
  });

});

app.get("/api/Manage/:password", async (req, res) => {
  console.log("Got api request!");

  let password = String(req.params.password)
  console.log(SECRET_PASSWORD);
  console.log(password);

  if (password != SECRET_PASSWORD) {
    res.json({
      message: "Incorrect password"
    })
    return;
  }
  let response = await Suggestion.find().limit(10);
  let toReturn = {}
  toReturn.data = response;
  toReturn.message = "Correct Password";
  res.send(toReturn);

})


app.put("/api/Manage", async (req, res) => {

  let requestBody = req.body;
  if (!requestBody.password || !requestBody.id) {
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

  let response = await Suggestion.deleteOne({
    _id: requestBody.id
  });
  console.log(response);
  console.log("Finish me, return positive resopnse!");
  res.send({
    message: "Success!"
  });

})

app.put("/api/Manage/Ban", async (req, res) => {

  let requestBody = req.body;
  if (!requestBody.password || !requestBody.id) {
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

  let commenterToBan = await Suggestion.findOne({
    _id: requestBody.id
  })
  let ip = commenterToBan.ipAddress;
  let newBan = new Ban({
    ip: ip
  });
  await newBan.save();
  await Suggestion.deleteMany({
    ipAddress: ip
  });
  res.send({
    message: "User with ip" + ip + " was banned successfully"
  })

})

app.delete("/api/Manage",
  async (req, res) => {
    let requestBody = req.body;
    if (!requestBody.password) {
      res.status(400);
      res.send({
        message: "Incomplete request"
      });
      return;
    }
    if (requestBody.password != SECRET_PASSWORD) {
      res.status(400);
      res.send({
        message: "Incorrect password"
      });
    }
    await Suggestion.remove({});
    res.status(200)
    res.send({
      message: "Removed all suggestions"
    });
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
    SKU: "",
    width: "",
    height: "",
    price: "",
    link: "#",
    name: "Unknown size",
  }

  let finishedGames = [];
  for (var game of Object.entries(games)) {
    game = game[1];
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
  return sleeves;
}

function updateDatabase() {
  let games = getGames();
  for (let game of games) {
    const currGame = new Game({
      name: game.name,
      sizes: game.sizes
    });
    currGame.save();

  }
  console.log("Finished!");

  console.log("Updating sleeves!");
  let sleeves = getSleevesArray();
  for (let sleeve of sleeves) {
    const currSleeve = new Sleeve(sleeve);
    currSleeve.save();
  }


}



async function clearDB() {
  await Suggestion.remove({});
  await Sleeve.remove({});
  await Game.remove({});

}