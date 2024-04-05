"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Footer from "@/components/Footer";

let otherPlayersPortfolios: React.FC = () => {

  const { data: session, status }: any = useSession();
  const [gameID, setGameID] = useState<string>("");
  const [portfolios, setPortfolios] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let email = session.user.email;

    try {
      let res = await fetch("/api/otherPlayersPortfolios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameID,
          email
        }),
      });

      if (res.status === 400) {
        setError("Game Not Found!");
        return;
      }

      const data = await res.json();
      setPortfolios(data);

    } catch (err) {
      console.log(err);
    }
  };

  if (!session) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-[#212121] p-8 rounded shadow-md w-900">
        <h1 className="text-4xl text-center font-semibold mb-8">View Other Players Portfolios</h1>
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
        {portfolios && (
          <div className="mt-8 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Leaderboard</h2>
            <p className="text-white-700 mb-4">Number of Players: {portfolios.length}</p>
            {portfolios.map((item: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-x-4 gap-y-2 hover:bg-gray-800 transition duration-300 rounded-md p-2"
              >
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Name</p>
                  <p className="text-white-700">{item.name}</p>
                </div>


                <div>
          <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>
          <div className="border border-gray-700 p-4 rounded-lg bg-gray-700">
            <div className="mb-4">
              <p className="text-lg font-medium text-white pt-2">Cash: ${item.portfolio.cash.toFixed(2)}</p>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">Stocks:</h3>
                {item.portfolio.stocks.length === 0 ? (
                    <p className="text-lg text-white">No Stocks Bought!</p>
                ) : (
                <ul>
                {item.portfolio.stocks.map((stock: any, index: any) => (
                    <li key={index} className="mb-2">
                    <p className="text-lg text-white">{stock.name}: {stock.quantity} shares, last buying price was ${stock.lastBuyingPrice}/share.</p>
                    </li>
                ))}
                </ul>
                )}
            </div>

          </div>
        </div>


              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
  
};

export default otherPlayersPortfolios;