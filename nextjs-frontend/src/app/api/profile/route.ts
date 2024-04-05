import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

let uri = "mongodb://localhost:27017";
let client = new MongoClient(uri);

export const profile = async (request: any) => {

    
    let { email } = await request.json();
    

    await client.connect();

    try {
        let res = await fetch(`http://localhost:4000/player`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
            }),
          });

          if (res.status == 200) {

            let data = await res.json();
            let dataToBeSend = JSON.stringify(data);
          
            return new NextResponse(dataToBeSend, { status: 200 });

          } else if (res.status == 404) {

                try {

                    let res2 = await fetch(`http://localhost:4000/admin`, {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                        email,
                        }),
                    });

                    if (res2.status == 200) {

                        let data = await res2.json();
                        let dataToBeSend = JSON.stringify(data);
                      
                        return new NextResponse(dataToBeSend, { status: 200 });
                    }

                } catch (err) {
                    console.log(err);
                }

          } else {
            return new NextResponse("Player not Found", { status: 400 });
          }

          
          
    } catch (err: any) {        
        console.log(err);
        return new NextResponse(err, { status: 400 });
    }
  

};

export const handler = profile;
export { handler as GET, handler as POST };
