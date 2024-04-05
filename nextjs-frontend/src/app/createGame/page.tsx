"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Footer from "@/components/Footer";

let createGame: React.FC = () => {
  const { data: session }: any = useSession();
  const [gameID, setGameID] = useState<string>("");
  const [gameName, setGameName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let email = session.user.email;
    
    try {
        
      let res = await fetch("/api/createGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameID,
          gameName,
          email
        }),
      });

      if (res.status === 400) {
        setError("Error Creating a new Game!");
        setSuccess("");
        return;
      }

      setSuccess("Successfully Created a new Game!");
      setError("");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-[#212121] p-8 rounded shadow-md w-900">
        <h1 className="text-4xl text-center font-semibold mb-8">Create a new Game</h1>
        <form onSubmit={handleSubmit} className="text-center">
          <input
            type="text"
            className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
            placeholder="Enter Game ID"
            value={gameID}
            onChange={(e) => setGameID(e.target.value)}
            required
          />
          <input
            type="text"
            className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
            placeholder="Enter Game Name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Create Game
          </button>
          {error && <p className="text-red-600 text-[16px] mb-4">{error}</p>}
          {success && <p className="text-green-600 text-[16px] mb-4">{success}</p>}
        </form>
      </div>
      <Footer />
    </div>
  );
  
};

export default createGame;
