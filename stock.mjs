import { MongoClient } from 'mongodb';


let uri = "mongodb://localhost:27017";
let dbName = "project3100";
let collectionName = "stocks";
let client = new MongoClient(uri);

export class Stock {

    constructor(fname, lname, email) {

        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.isAdmin = true;  //Gives Admin Capabilities
        
    };

    async addToDB() {

        try {
          
          await client.connect();
    
          let db = client.db(dbName);
          let collection = db.collection(collectionName);
    
          let result = await collection.insertOne(this);
          
          await client.close();

        } catch (err) {
          console.error('Error adding stock to database:', err);
        }

    }



}
