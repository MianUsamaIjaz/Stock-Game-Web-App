import express from 'express';
import cors from 'cors';
import { Player } from './player.mjs';
import { Admin } from './admin.mjs';
import { Game } from './game.mjs';
import 'dotenv/config';
import fetch from 'node-fetch';


const app = express();

let allPlayers = [];
let allAdmins = [];
let allGames = [];
let transactionFee = 1; // One Dollar transaction fee for every buy/sell

app.use(express.json());// support json encoded bodies
app.use(express.urlencoded({extended: true}));//incoming objects are strings or arrays
app.use(cors());

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
    if (data.length > 0) {
      res.status(200).json(data);
      return;
    } else {
      res.status(404).send("Stock not Found");
      return;
    }
    
  } catch (error) {

    console.error('Error fetching data: ', error);
    res.status(404).send('An Error Occured while retrieving Data');

  }

});

// Player buying a stock
app.post("/buy", async (req, res) => {

  let pl = req.body.player;
  let stockName = req.body.stockName;
  let quantity = req.body.quantity;

  let player = await Player.getPlayerFromDB(pl);

  if (!player) {
    res.status(404).send("No Player Found!");
    return;
  }

  let stockURL = "https://financialmodelingprep.com/api/v3/quote-order/" + stockName + "?apikey=" + process.env.stockAPIKey;

  try {

    let response = await fetch(stockURL);
    let data = await response.json();

    if (!(data.length > 0)) {
      res.status(404).send("Data from the API not found!");
      return;
    }

    let stockPrice = data[0].price;
    let alreadyBought = false;
    
    if ( ((stockPrice * quantity) + transactionFee) <= player.portfolio.cash) {

      // If Player have already bought the stock
      player.portfolio.stocks.forEach(data => {
        
        if (data.name === stockName) {

          alreadyBought = true;
          data.quantity += quantity;
          data.lastBuyingPrice = stockPrice;
          player.portfolio.cash = player.portfolio.cash - (stockPrice * quantity) - transactionFee;
          Player.save(player);
          res.status(200).send(data);
          return;
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
          player.portfolio.cash = player.portfolio.cash - (stockPrice * quantity) - transactionFee;
          Player.save(player);
          res.status(200).send(stockBought);

      };

    } else {
      res.status(403).send("Player don't have enough cash to buy " + quantity + " stocks of " + stockName);
      return;
    }

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

  if (!player) {
    res.status(404).send("No Player Found!");
    return;
  }

  let stockURL = "https://financialmodelingprep.com/api/v3/quote-order/" + stockName + "?apikey=" + process.env.stockAPIKey;

  try {

    let response = await fetch(stockURL);
    let data = await response.json();

    if (!(data.length > 0)) {
      res.status(404).send("Data from the API not found!");
      return;
    }

    let stockPrice = data[0].price;

    let stockFound = player.portfolio.stocks.find(s =>
      s.name === stockName
    );

    if (!stockFound) {
      res.status(404).send("Stock not found!");
      return;
    }

    let correctQuantity = stockFound.quantity >= quantity;

    if (!correctQuantity) {
      res.status(403).send("Not Enough Stocks to Sell!");
      return;
    }

    if (transactionFee > player.portfolio.cash) {
      res.status(403).send("You don't have enough money for transaction fee!")
    }
    
    if ( stockFound && correctQuantity && player.portfolio.cash >= transactionFee) {

      stockFound.quantity = stockFound.quantity - quantity;
      stockFound.lastSellingPrice = stockPrice;

      player.portfolio.cash = player.portfolio.cash + (stockPrice * quantity) - transactionFee;
      Player.save(player);
      res.status(200).send(stockFound);

    } else {
      res.status(403).send("Player don't have stocks of " + stockName + " to sell.");
      return;
    }

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
  let password = req.body.password;


  let playerMatched = allPlayers.find(player =>
    player.email === email
  );
  
  if (!playerMatched) {

    let player = new Player(fname, lname, email, password);

    player.addToDB();
    allPlayers.push(player);

    res.status(200).send(player);

  } else {
      res.status(403).send("Player with this email already exists! Please try creating a Player with another email!")
  }

});

// Creates a new Admin
app.post("/createAdmin", (req, res) => {

  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let password = req.body.password;


  let adminMatched = allAdmins.find(admin =>
    admin.email === email
  );
  
  if (!adminMatched) {

    let admin = new Admin(fname, lname, email, password);

    admin.addToDB();
    allAdmins.push(admin);

    res.status(200).send(admin);

  } else {
      res.status(403).send("Admin with this email already exists! Please try creating an Admin with another email!");
  }
  

});

// Creates a new Game
app.post("/createGame", (req, res) => {

  let id = req.body.id;
  let name = req.body.name;
  let owner = req.body.owner;

  let adminAccess = allAdmins.find(admin =>
    admin.fname === owner.fname && admin.lname === owner.lname && admin.email === owner.email
  );

  if (!adminAccess) {
    res.status(403).send("Only Admins can create the game!");
    return;
  }

  let gameMatched = allGames.find(game =>
    game.id === id
  );

  if (gameMatched) {
    res.status(200).send("Game Already Exists!");
    return;
  }

  if (adminAccess && !gameMatched) {

    let game = new Game( id, name, owner);
    

    game.addToDB();
    allGames.push(game);

    res.status(200).send(game);

  } else {
    res.status(404).send("Could not create a game!")
  }

});

// Registers a player for the game
app.post("/registerPlayer", async (req, res) => {

  let gameID = req.body.gameID;
  let player = req.body.player;

  let adminCheck = allAdmins.find(admin =>
    admin.email === player.email
  );

  let gameCheck = allGames.find(g =>
    g.id === gameID
  );

  if (!gameCheck) {
    res.status(403).send("Game not found");
    return;
  }

  let playerFound = await Player.getPlayerFromDB(player);

  if (!playerFound) {
    res.status(404).send("The Player does not exist, please create this player first!");
    return;
  }

  if (adminCheck) {
    res.status(403).send("Admins cannot join a game!");
    return;
  }

  let gameFound = await Game.getGameFromDB(gameID);

  if (gameFound) {

    let playerExistsinGame = gameFound.registeredPlayers.find(p =>
      p.email === player.email
    );

    if (playerExistsinGame) {
      res.status(403).send("Player is already in the Game!");
      return;
    }

    let cap = gameFound.registeredPlayers.length;

    if (cap >= 4) {
      res.status(403).send("Cannot Register the Player, since the Game have already been started!");
      return;
    }

    gameFound.registeredPlayers.push(player);
    Game.save(gameFound);

    if (gameFound.registeredPlayers.length == 4) {

      Game.startGame(gameFound);
      Game.save(gameFound);
      res.status(201).send(gameFound);
      return;

    }

    res.status(200).send("Player was successfully Registered for the Game.");

  } else {

    res.status(404).send("Game not found!");

  }

});

app.get("/gameStatus", async (req,res) => {

  let gameID = req.body.gameID;
  

  let game = await Game.getGameFromDB(gameID);

  if (!game) {
    res.status(404).send("Game not found!")
  }

  if (game.startTime == 0) {
    res.status(200).send("The Game hasn't started yet!")
  }

  let result = Game.hasGameEnded(game);

  if (result) {
    res.status(200).send("The Game have been ended!");
    return;
  } else {
    res.status(200).send("The Game is still in progress!");
    return;
  }
  
});

app.get("/checkWinner", async (req,res) => {

  let gameID = req.body.gameID;

  let gameCheck = allGames.find(g =>
    g.id === gameID
  );

  if (!gameCheck) {
    res.status(403).send("Game not found");
    return;
  }

  let game = await Game.getGameFromDB(gameID);

  if (game.startTime == 0) {
    res.status(403).send("The Game hasn't started!");
    return;
  }

  let result = Game.hasGameEnded(game);

  if (result) {

    let winnerWorth = 0;
    let winner = null;

    for (let i = 0; i < game.registeredPlayers.length; i++) {

      let player = await Player.getPlayerFromDB(game.registeredPlayers[i]);

      let playerTotalWorth = 0;

      for (let stock of player.portfolio.stocks) {

        let stockURL = "https://financialmodelingprep.com/api/v3/quote-order/" + stock.name + "?apikey=" + process.env.stockAPIKey;

        try {

          let response = await fetch(stockURL);
          let data = await response.json();

          let stockPrice = data[0].price;

          playerTotalWorth += stockPrice * stock.quantity;

        } catch (error) {

            console.error('Error fetching data: ', error);
            res.status(500).send('An error occurred');
  
        }
      }

      playerTotalWorth += player.portfolio.cash;
      //console.log(playerTotalWorth);

      if (playerTotalWorth > winnerWorth) {
        winnerWorth = playerTotalWorth;
        winner = player;
      }

    }

    res.status(200).send(winner);

  } else {
    res.status(500).send("Game not ended yet!");
    return;
  }


});

// First Own Feature (Viewing other player's portfolios)
app.get("/otherPlayersPortfolio", async (req, res) => {

  let gameID = req.body.gameID;
  let player = req.body.player;  // The player requesting to view other's portfolios

  let game = await Game.getGameFromDB(gameID);
  if (!game) {
    res.status(404).send("Game not found!");
    return;
  }

  player = await Player.getPlayerFromDB(player);
  if (!player) {
    res.status(404).send("Player not found!");
    return;
  } 

  let othersPortfolios = [];

  for (let i = 0; i < game.registeredPlayers.length; i++) {

    let otherPlayer = await Player.getPlayerFromDB(game.registeredPlayers[i]);

    if (!(otherPlayer.email === player.email)) {

      let view = {
        name: otherPlayer.fname + " " + otherPlayer.lname,
        portfolio: otherPlayer.portfolio
      };

      othersPortfolios.push(view);

    }
    
  }

  res.send(othersPortfolios);

});

app.get("/leaderboard", async (req, res) => {

  let gameID = req.body.gameID;

  let game = await Game.getGameFromDB(gameID);

  if (!game) {
    res.status(404).send("Game not found!");
    return;
  }


  if (game.registeredPlayers.length !== 4) {
    res.status(400).send("Game must have exactly 4 players for leaderboard.");
    return;
  }

  let gamePlayers = [];

  for (let i = 0; i < game.registeredPlayers.length; i++) {
    let player = await Player.getPlayerFromDB(game.registeredPlayers[i]);
    if (!player) {
      res.status(404).send("Player not found!");
      return;
    }
    gamePlayers.push(player);
  }

  gamePlayers.sort((a, b) => b.portfolio.cash - a.portfolio.cash);

  let leaderboard = gamePlayers.map(player => {
    return {
      name: `${player.fname} ${player.lname}`,
      cash: player.portfolio.cash
    };
  });

  res.status(200).send(leaderboard);

});

app.post("/signin", async (req, res) => {

  let email = req.body.email;
  let password = req.body.password;

  let playerMatched = allPlayers.find(player =>
    player.email === email
  );
  
  if (playerMatched) {

    let player = await Player.getPlayerFromDB(playerMatched);

    if (password === player.password && email === player.email) {
      res.status(200).send("Successfully Signed In!")
    } else {
      res.status(404).send("Invalid Credentials!")
    }

  } else {
      res.status(404).send("Player not found!")
  }

});

app.listen(4000, () => {
    console.log("Server started on port 4000");
});