import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

let uri = "mongodb://localhost:27017";
let client = new MongoClient(uri);

export const Navbar = async (request: any) => {
    
    let { email } = await request.json();
    

    await client.connect();

    try {

        let res = await fetch(`http://localhost:4000/getAdmin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
            }),
          });

          let data = await res.json();
          
          if (data) {
            return new NextResponse(data, { status: 200 });
          } else {
            return new NextResponse(data, { status: 403 });
          }
          
          
    } catch (err: any) {        
        console.log(err);
        return new NextResponse(err, { status: 400 });
    }
  

};

export const handler = Navbar;
export { handler as GET, handler as POST };
