import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

let uri = "mongodb://localhost:27017";
let client = new MongoClient(uri);

export const createGame = async (request: any) => {

    
    let { gameID, gameName, email } = await request.json(); 
    
    let owner = {
        email: email
    };

    gameID = parseInt(gameID);

    await client.connect();

    try {
        let res = await fetch(`http://localhost:4000/createGame`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gameID,
                gameName,
                owner,
            }),
          });

          let data = await res.json();
          
          let dataToBeSend = JSON.stringify(data);          

          return new NextResponse(dataToBeSend, { status: 200 });
          
    } catch (err: any) {        
        console.log(err);
        return new NextResponse(err, { status: 400 });
    }
  

};

export const handler = createGame;
export { handler as GET, handler as POST };
