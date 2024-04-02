"use client";
import React, { useState } from "react";

let Leaderboard: React.FC = () => {
  const [gameID, setGameID] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameID,
        }),
      });

      if (res.status === 400) {
        setError("Game Not Found!");
        return;
      }

      const data = await res.json();
      setLeaderboard(data); // No need to stringify here

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-[#212121] p-8 rounded shadow-md w-900">
        <h1 className="text-4xl text-center font-semibold mb-8">Leaderboard</h1>
        <form onSubmit={handleSubmit} className="text-center">
          <input
            type="text"
            className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
            placeholder="Enter Game ID"
            value={gameID}
            onChange={(e) => setGameID(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Get Details
          </button>
          {error && <p className="text-red-600 text-[16px] mb-4">{error}</p>}
        </form>
        {leaderboard && (
          <div className="mt-8 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Leaderboard</h2>
            <p className="text-white-700 mb-4">Number of Players: {leaderboard.length}</p>
            {leaderboard.map((item: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-x-4 gap-y-2 hover:bg-gray-800 transition duration-300 rounded-md p-2"
              >
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Name</p>
                  <p className="text-white-700">{item.name}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Cash</p>
                  <p className="text-white-700">{item.cash}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Leaderboard;
