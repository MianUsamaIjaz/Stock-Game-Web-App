import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

let uri = "mongodb://localhost:27017";
let client = new MongoClient(uri);

export const sell = async (request: any) => {

    
    let { email, stockName, quantity } = await request.json();
    let player = {
        email: email
    };      

    await client.connect();

    try {
        let res = await fetch(`http://localhost:4000/sell`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              player,
              stockName,
              quantity
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

export const handler = sell;
export { handler as GET, handler as POST };
