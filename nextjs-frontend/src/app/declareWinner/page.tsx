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

const DeclareWinner: React.FC = () => {
  const { data: session, status } = useSession();
  const [games, setGames] = useState<Array<Game> | null>(null);
  const [joinedGames, setJoinedGames] = useState<string[]>([]);
  const [disabledButtons, setDisabledButtons] = useState<Record<string, boolean>>({});
  const [winners, setWinners] = useState<Record<string, Player>>({});


  useEffect(() => {

    fetchGames();
    const localJoinedGames = localStorage.getItem("joinedGames");
    if (localJoinedGames) {
      setJoinedGames(JSON.parse(localJoinedGames));
    }
  }, [session]);

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

  const handleCheckWinner = async (gameID: string) => {
    try {
      const res = await fetch("/api/declareWinner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameID: gameID,
        }),
      });

      if (res.ok) {
        const winnerPlayer = await res.json();
        setWinners((prevWinners) => ({
          ...prevWinners,
          [gameID]: winnerPlayer,
        }));

        setDisabledButtons((prevDisabledButtons) => ({
          ...prevDisabledButtons,
          [gameID]: true,
        }));

        setJoinedGames((prevJoinedGames) => [...prevJoinedGames, gameID]);
        fetchGames();
      } else {
        console.error("Error declaring the winner:", res.statusText);
      }
    } catch (error) {
      console.error("Error declaring the winner:", error);
    }
  };

  if (!games) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
        <h1 className="text-3xl font-semibold mb-6">Available Games</h1>
        <div>
          {games.map((game: Game) => (
            <div key={game.id} className="mb-4">
              <p className="text-lg font-medium text-white">ID: {game.id}</p>
              <p className="text-lg font-medium text-white">Name: {game.name}</p>
              <p className="text-lg font-medium text-white">Owner: {game.owner.email}</p>
              <p className="text-lg font-medium text-white">Registered Players: {game.registeredPlayers.length}/4</p>
              {game.registeredPlayers.length !== 4 ? (
                <button
                  className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-500 text-sm"
                  disabled
                  style={{
                    cursor: "not-allowed",
                    opacity: 0.5,
                  }}
                >
                  Game Not Started
                </button>
              ) : (
                <button
                  id={game.id}
                  onClick={() => handleCheckWinner(game.id)}
                  className={`bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-500 text-sm ${
                    joinedGames.includes(game.id) && "cursor-not-allowed opacity-50"
                  }`}
                  disabled={joinedGames.includes(game.id) || disabledButtons[game.id]}
                >
                  {disabledButtons[game.id] ? "Results Generated" : "Declare Winner"}
                </button>
              )}
              {winners[game.id] && (
                <p className="text-lg font-medium text-white"> Winner: {winners[game.id].fname} {winners[game.id].lname}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeclareWinner;
