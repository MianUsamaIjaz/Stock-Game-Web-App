import { MongoClient } from 'mongodb';


let uri = "mongodb://localhost:27017";
let dbName = "project3100";
let collectionName = "admins";
let client = new MongoClient(uri);

export class Admin {

    constructor(fname, lname, email, password) {

        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.password = password;
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
          console.error('Error adding admin to database:', err);
        }

    }


    static async load() {
        try {

            await client.connect();
            let database = client.db(dbName);
            let collection = database.collection(collectionName);
    
            let adminData = await collection.find({}).toArray();
            let allAdmins = [];

            for (let data of adminData) {
                let admin = new Admin(data.fname, data.lname, data.email, data.password);
                allAdmins.push(admin);
            }

        

            return allAdmins;

        } catch (error) {
            console.error('Error loading admins from MongoDB:', error);
            throw error;
        } 

      }

      static async getAdminFromDB(admin) {
        
        try {

            await client.connect();
            let database = client.db(dbName);
            let collection = database.collection(collectionName);
    
            let adminData = await collection.find({}).toArray();

            for (let data of adminData) {

                if ( data.email === admin.email ) {
                    return data;
                };

            };

            return;

        } catch (error) {
            console.error('Error loading admin from MongoDB:', error);
            return;
        } 
        
    };


}
