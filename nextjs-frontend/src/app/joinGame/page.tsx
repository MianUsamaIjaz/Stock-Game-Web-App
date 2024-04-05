"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Admin } from "../../../../admin.mjs";
import { Player } from "../../../../player.mjs";
import Footer from "@/components/Footer";

interface Game {
    id: string;
    name: string;
    owner: Admin;
    registeredPlayers: Array<Player>;
  }

const JoinGame: React.FC = () => {
  const { data: session, status } = useSession();
  const [games, setGames] = useState<any>(null);
  const [buttonText, setButtonText] = useState<string>("Join Game");
  const [joinedGames, setJoinedGames] = useState<string[]>([]);


  const fetchGames = async () => {
    try {
      const res = await fetch("/api/listAllGames");
      if (res.ok) {
        const data = await res.json();
        setGames(data);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  useEffect(() => {
    fetchGames();
    // Check if joined games exist in localStorage
    const localJoinedGames = localStorage.getItem("joinedGames");
    if (localJoinedGames) {
      setJoinedGames(JSON.parse(localJoinedGames));
    }
  }, [session]);

  const handleJoinGame = async (gameID: string) => {
    
    try {
      const res = await fetch("/api/joinGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            gameID: gameID,
          email: session?.user?.email,
        }),
      });
      if (res.ok) {
        setJoinedGames([...joinedGames, gameID]);
        setButtonText("Joined");
        fetchGames();
      } else {
        console.error("Error joining the game:", res.statusText);
      }
    } catch (error) {
      console.error("Error joining the game:", error);
    }
  };

  const playerJoined = async (gameID: string) => {

    try {
        const res = await fetch("/api/joinGame", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
              gameID: gameID,
            email: session?.user?.email,
          }),
        });
        if (res.status == 400  && joinedGames.includes(gameID)) {
          fetchGames();
          return true;
        } else {            
            return false;
        }
    } catch (err) {
        console.log(err);
    }

  }


  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
        <h1 className="text-3xl font-semibold mb-6">Available Games</h1>
        <div>
        {games && games.map((game: Game) => (
            <div key={game.id} className="mb-4">
              <p className="text-lg font-medium text-white">ID: {game.id}</p>
              <p className="text-lg font-medium text-white">Name: {game.name}</p>
              <p className="text-lg font-medium text-white">Owner: {game.owner.email}</p>
              <p className="text-lg font-medium text-white">Registered Players: {game.registeredPlayers.length}/4</p>
              {game.registeredPlayers.length === 4 ? (
                <button
                  className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-500 text-sm"
                  disabled
                  style={{
                    cursor: "not-allowed",
                    opacity: 0.5,
                  }}
                >
                  Game Full
                </button>
              ) : (
                <button
                onClick={() => handleJoinGame(game.id)}
                className={`bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-500 text-sm ${joinedGames.includes(game.id) && 'cursor-not-allowed opacity-50'}`}
                disabled={joinedGames.includes(game.id)? true: false}
              >
                {joinedGames.includes(game.id) ? "Game Joined" : "Join Game"}
              </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JoinGame;
