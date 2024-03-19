import express from 'express';
import { Player } from './player.mjs';
import { Admin } from './admin.mjs';
import { Game } from './game.mjs';
import 'dotenv/config';
import fetch from 'node-fetch';


const app = express();

let allPlayers = [];
let allAdmins = [];
let allGames = [];

app.use(express.json());// support json encoded bodies
app.use(express.urlencoded({extended: true}));//incoming objects are strings or arrays

// Loading all admins from database to the server
Admin.load().then(loadedAdmins => {
    allAdmins = loadedAdmins;
})
.catch(error => {
    console.error('Error loading admins from MongoDB:', error);
});

// Loading all players from database to the server
Player.load().then(loadedPlayers => {
  allPlayers = loadedPlayers;
})
.catch(error => {
  console.error('Error loading players from MongoDB:', error);
});

// Loading all games from database to the server
Game.load().then(loadedGames => {
  allGames = loadedGames;
})
.catch(error => {
  console.error('Error loading games from MongoDB:', error);
});



//Gets the user requested stock data
app.get("/stock/:stockName", async (req, res) => {

  let {stockName} = req.params;
  let stockURL = "https://financialmodelingprep.com/api/v3/quote-order/" + stockName + "?apikey=" + process.env.stockAPIKey;

  try {

    let response = await fetch(stockURL);
    let data = await response.json();
    res.json(data);

  } catch (error) {

    console.error('Error fetching data: ', error);
    res.status(500).send('An error occurred');

  }

});

// Player buying a stock
app.post("/buy", async (req, res) => {

  let pl = req.body.player;
  let stockName = req.body.stockName;
  let quantity = req.body.quantity;

  let player = await Player.getPlayerFromDB(pl);

  let stockURL = "https://financialmodelingprep.com/api/v3/quote-order/" + stockName + "?apikey=" + process.env.stockAPIKey;

  try {

    let response = await fetch(stockURL);
    let data = await response.json();

    let stockPrice = data[0].price;
    let alreadyBought = false;
    
    if ( (stockPrice * quantity) <= player.portfolio.cash) {

      // If Player have already bought the stock
      player.portfolio.stocks.forEach(data => {
        
        if (data.name === stockName) {

          alreadyBought = true;
          data.quantity += quantity;
          data.lastBuyingPrice = stockPrice;
          player.portfolio.cash = player.portfolio.cash - (stockPrice * quantity);
          Player.save(player);

        };
    
      });

      if (!alreadyBought) {

        let stockBought = {
          name: stockName,
          quantity: quantity,
          lastBuyingPrice: stockPrice,
          lastSellingPrice: null
          };
      
          player.portfolio.stocks.push(stockBought);
          player.portfolio.cash = player.portfolio.cash - (stockPrice * quantity);
          Player.save(player);

      };

    } else {
      res.send("Player don't have enough cash to buy " + quantity + " stocks of " + stockName);
      return;
    }

    res.send(player);

  } catch (error) {

    console.error('Error fetching data: ', error);
    res.status(500).send('An error occurred');

  };

});

// Player selling a stock
app.post("/sell", async (req, res) => {

  let pl = req.body.player;
  let stockName = req.body.stockName;
  let quantity = req.body.quantity;

  let player = await Player.getPlayerFromDB(pl);

  let stockURL = "https://financialmodelingprep.com/api/v3/quote-order/" + stockName + "?apikey=" + process.env.stockAPIKey;

  try {

    let response = await fetch(stockURL);
    let data = await response.json();

    let stockPrice = data[0].price;

    let stockFound = player.portfolio.stocks.find(s =>
      s.name === stockName
    );

    let correctQuantity = stockFound.quantity >= quantity;
    
    if ( stockFound && correctQuantity ) {

      stockFound.quantity = stockFound.quantity - quantity;
      stockFound.lastSellingPrice = stockPrice;

      player.portfolio.cash = player.portfolio.cash + (stockPrice * quantity);
      Player.save(player);

    } else {
      res.send("Player don't have stocks of " + stockName + " to sell.");
      return;
    }

    res.send(player);

  } catch (error) {

    console.error('Error fetching data: ', error);
    res.status(500).send('An error occurred');

  }


});


// Creates a new Player
app.post("/createPlayer", (req, res) => {

  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;


  let playerMatched = allPlayers.find(player =>
    player.email === email
  );
  
  if (!playerMatched) {

    let player = new Player(fname, lname, email);

    player.addToDB();
    allPlayers.push(player);

    res.send("Player created!");

  } else {
      res.send("Player with this email already exists! Please try creating a Player with another email!")
  }

});

// Creates a new Admin
app.post("/createAdmin", (req, res) => {

  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;


  let adminMatched = allAdmins.find(admin =>
    admin.email === email
  );
  
  if (!adminMatched) {

    let admin = new Admin(fname, lname, email);

    admin.addToDB();
    allAdmins.push(admin);

    res.send("Admin Created");

  } else {
      res.send("Admin with this email already exists! Please try creating an Admin with another email!")
  }
  

});

// Creates a new Game
app.post("/createGame", (req, res) => {

  let id = req.body.id;
  let name = req.body.name;
  let players = req.body.players;
  let owner = req.body.owner;

  let adminAccess = allAdmins.find(admin =>
    admin.fname === owner.fname && admin.lname === owner.lname && admin.email === owner.email
  );

  let gameMatched = allGames.find(game =>
    game.id === id
  );

  if (adminAccess && !gameMatched) {

    let game = new Game( id, name, players, owner);
    

    game.addToDB();
    allGames.push(game);

    res.send(game);

  } else {
    res.send("Could not create a game!")
  }

});

// Registers a player for the game
app.post("/registerPlayer", (req, res) => {

  let gameName = req.body.gameName;
  let player = req.body.player;

  let adminCheck = allAdmins.find(admin =>
    admin.email === player.email
  );

  if (adminCheck) {
    res.send("Admins cannot join a game!");
    return;
  }

  let gameFound = allGames.find(game =>
    game.name === gameName
  );

  if (gameFound) {

    let playerExists = gameFound.players.find(p =>
      p.email === player.email
    );

    if (playerExists) {
      res.send("Player is already in the Game!");
      return;
    }

    gameFound.players.push(player);
    Game.save(gameFound);

    res.send(gameFound);

  } else {

    res.send("Game not found!");

  }

});



app.listen(3000, () => {
    console.log("Server started on port 3000");
});