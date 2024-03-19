import { MongoClient } from 'mongodb';


let uri = "mongodb://localhost:27017";
let dbName = "project3100";
let collectionName = "games";
let client = new MongoClient(uri);

export class Game {

    constructor(id, name, players, owner) {
        this.id = id;
        this.name = name;
        this.players = players;
        this.owner = owner;  
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
                let game = new Game(data.id, data.name, data.players, data.owner);
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
                await collection.updateOne({ _id: gameMatched._id }, { $set: { players: game.players, owner: game.owner } });
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


}
