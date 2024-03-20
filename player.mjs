import { MongoClient } from 'mongodb';


let uri = "mongodb://localhost:27017";
let dbName = "project3100";
let collectionName = "players";
let client = new MongoClient(uri);

export class Player {

    constructor(fname, lname, email) {
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.portfolio = {
            cash: 1000,
            stocks: []
        };
    };

    async addToDB() {

        try {
          
          await client.connect();
    
          let db = client.db(dbName);
          let collection = db.collection(collectionName);
    
          let result = await collection.insertOne(this);
          
          await client.close();

        } catch (err) {
          console.error('Error adding player to database:', err);
        }

    };

    static async load() {
        try {

            await client.connect();
            let database = client.db(dbName);
            let collection = database.collection(collectionName);
    
            let playerData = await collection.find({}).toArray();
            let allPlayers = [];

            for (let data of playerData) {
                let player = new Player(data.fname, data.lname, data.email, data.portfolio);
                allPlayers.push(player);
            }

        

            return allPlayers;

        } catch (error) {
            console.error('Error loading players from MongoDB:', error);
            throw error;
        } finally {
            await client.close();
        }

    };

    static async save(player) {

        try {

            await client.connect();
            let database = client.db(dbName);
            let collection = database.collection(collectionName);
    
            let playerMatched = await collection.findOne({ email: player.email });

            if (playerMatched) {
                await collection.updateOne({ _id: playerMatched._id }, { $set: { portfolio: player.portfolio } });
            } else {
                console.log("Player not found!");
            }

        } catch (error) {
            console.error('Error saving the player to MongoDB:', error);
            throw error;
        } finally {
            await client.close();
        }

    };

    static async getPlayerFromDB(player) {
        
        try {

            await client.connect();
            let database = client.db(dbName);
            let collection = database.collection(collectionName);
    
            let playerData = await collection.find({}).toArray();

            for (let data of playerData) {

                if ( data.email === player.email && data.fname === player.fname && data.lname === player.lname) {
                    return data;
                };

            };

            return;

        } catch (error) {
            console.error('Error loading player from MongoDB:', error);
            throw error;
        } finally {
            await client.close();
        }
        
    };


}
