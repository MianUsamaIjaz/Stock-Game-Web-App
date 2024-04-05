import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

let uri = "mongodb://localhost:27017";
let client = new MongoClient(uri);

export const joinGame = async (request: any) => {

    
    let { gameID, email } = await request.json();     
    let player = {
        email: email
    };    

    await client.connect();

    try {
        let res = await fetch(`http://localhost:4000/registerPlayer`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gameID,
                player,
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

export const handler = joinGame;
export { handler as GET, handler as POST };
