import { Player } from "../../../../../player.mjs";
import { Admin } from "../../../../../admin.mjs";
import { MongoClient } from 'mongodb';
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

let uri = "mongodb://localhost:27017";
let client = new MongoClient(uri);

export const POST = async (request: any) => {


  let { fname, lname, email, password, isChecked } = await request.json();

  await client.connect();

  if (!isChecked) { //Create a Player

    let player = new Player(fname, lname, email, password);

    const existingUser = await Player.getPlayerFromDB(player);

    if (existingUser) {
      return new NextResponse("Email is already in use", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const newPlayer = new Player(
      fname,
      lname,
      email,
      hashedPassword,
    );  

    try {
      await newPlayer.addToDB();
      return new NextResponse("user is registered", { status: 200 });
    } catch (err: any) {
      return new NextResponse(err, {
        status: 500,
      });
    }

  } else {  //Create an admin

    let admin = new Admin(fname, lname, email, password);

    const existingUser = await Admin.getAdminFromDB(admin);

    if (existingUser) {
      return new NextResponse("Email is already in use", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const newAdmin = new Admin(
      fname,
      lname,
      email,
      hashedPassword,
    );  

    try {
      await newAdmin.addToDB();
      return new NextResponse("user is registered", { status: 200 });
    } catch (err: any) {
      return new NextResponse(err, {
        status: 500,
      });
    }

  }

  
};