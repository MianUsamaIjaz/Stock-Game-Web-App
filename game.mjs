import { MongoClient } from 'mongodb';


let uri = "mongodb://localhost:27017";
let dbName = "project3100";
let collectionName = "games";
let client = new MongoClient(uri);

export class Game {

    //static DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    static DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds (Testing)

    constructor(id, name, owner) {
        this.id = id;
        this.name = name;
        this.owner = owner;  
        this.startTime = 0;
        this.endTime = 0;
        this.registeredPlayers = [];
    };

    async addToDB() {

        try {
          
          await client.connect();
    
          let db = client.db(dbName);
          let collection = db.collection(collectionName);
    
          let result = await collection.insertOne(this);
          
          await client.close();

        } catch (err) {
          console.error('Error adding game to database:', err);
        }

    }

    static async load() {
        try {

            await client.connect();
            let database = client.db(dbName);
            let collection = database.collection(collectionName);
    
            let gameData = await collection.find({}).toArray();
            let allGames = [];

            for (let data of gameData) {
                let game = new Game(data.id, data.name, data.owner, data.startTime, data.endTime, data.registeredPlayers);
                allGames.push(game);
            }

        

            return allGames;

        } catch (error) {
            console.error('Error loading games from MongoDB:', error);
            throw error;
        } finally {
            await client.close();
        }

      }

      static async save(game) {

        try {

            await client.connect();
            let database = client.db(dbName);
            let collection = database.collection(collectionName);
    
            let gameMatched = await collection.findOne({ name: game.name });

            if (gameMatched) {
                await collection.updateOne({ _id: gameMatched._id }, { $set: { registeredPlayers: game.registeredPlayers, startTime: game.startTime, endTime: game.endTime} });
            } else {
                console.log("Game not found!");
            }

        } catch (error) {
            console.error('Error saving the game to MongoDB:', error);
            throw error;
        } finally {
            await client.close();
        }

      }

      static startGame(game) {
        game.startTime = Date.now();
        game.endTime = game.startTime + Game.DURATION;
      }

      static hasGameEnded(game) {

        if (game.startTime === 0) {
          return false; // The game hasn't started yet
        }

        return Date.now() >= game.endTime;

      }

      static async getGameFromDB(gameID) {
        
        try {

            await client.connect();
            let database = client.db(dbName);
            let collection = database.collection(collectionName);
    
            let gameData = await collection.find({}).toArray();

            for (let data of gameData) {

                if ( data.id === gameID ) {
                    return data;
                };

            };

            return;

        } catch (error) {
            console.error('Error loading game from MongoDB:', error);
            throw error;
        } finally {
            await client.close();
        }
        
    };



}
