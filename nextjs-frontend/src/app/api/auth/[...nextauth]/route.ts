import NextAuth from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { Player } from "../../../../../../player.mjs";
import { MongoClient } from 'mongodb';
import bcrypt from "bcryptjs";
import { Admin } from "../../../../../../admin.mjs";

let uri = "mongodb://localhost:27017";
let client = new MongoClient(uri);

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        fname: { label: "First Name", type: "text" },
        lname: { label: "Last Name", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "text" },
        isAdmin: { label: "Admin", type: "boolean"},
      },
      async authorize(credentials: any) {
        await client.connect();
        try {

          let player = new Player(credentials.fname, credentials.lname, credentials.email, credentials.password);

          let user = await Player.getPlayerFromDB(player);

          if (!user) {
            user = await Admin.getAdminFromDB(player);
            credentials.isAdmin = true;
          }

          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            
            if (isPasswordCorrect) {
              return credentials;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      if (account?.provider == "credentials") {
        
        return true;
      }
      if (account?.provider == "github") {
        await client.connect();
        try {

          let player = new Player("", "", user.email, "");

          const existingUser = await Player.getPlayerFromDB(player);
          if (!existingUser) {
            const newUser = new Player(user.name, "", user.email, "");
            await newUser.addToDB();
            return true;
          } else {
            let admin = await Admin.getAdminFromDB(player);
            if (admin) {
              return true;
            }
          }
          return true;
        } catch (err) {
          console.log("Error saving user", err);
          return false;
        }
      }
    },

  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };