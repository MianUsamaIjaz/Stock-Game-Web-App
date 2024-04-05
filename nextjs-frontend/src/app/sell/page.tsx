"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "@/components/Footer";

type Profile = {
    portfolio: {
      cash: number;
      stocks: { name: string; quantity: number }[];
    };
  };

const SellStocks = () => {
  
  const { data: session, status }: any = useSession();
  const [stockName, setStockName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  

  const handleSellStock = async () => {
    try {
      const res = await fetch("/api/sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          stockName,
          quantity: parseInt(quantity),
        }),
      });

      if (res.ok) {
        setMessage("Stock sold successfully!");
        setError("");
        fetchPortfolio();
      } else {
        setError("Error selling stocks. Please try again later.");
        setMessage("");
      }
    } catch (err) {
      console.error("Error selling stocks:", err);
      setError("Error selling stocks. Please try again later.");
      setMessage("");
    }
  };

  const fetchPortfolio = async () => {
    try {
      if (session && session.user.email) {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.user.email,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      }
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [session]);

  if (!profile) {
    return <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <h1>Loading...</h1>
  </div>
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
        <h1 className="text-3xl font-semibold mb-6">Sell Stocks</h1>
        <div className="mb-6">
          <label className="block text-md font-medium text-white">Stock Symbol:</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-black text-md pl-2 pt-1 pb-1"
            value={stockName}
            onChange={(e) => setStockName(e.target.value.toUpperCase())}
            placeholder="Enter stock symbol"
          />
        </div>
        <div className="mb-6">
          <label className="block text-md font-medium text-white">Quantity:</label>
          <input
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-black text-md pl-2 pt-1 pb-1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter stock quantity"
          />
        </div>
        <button
          className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-500 text-md "
          onClick={handleSellStock}
        >
          Sell Stock
        </button>
        {message && <p className="text-green-600 text-[16px] mb-4 pt-2">{message}</p>}
        {error && <p className="text-red-600 text-[16px] mb-4 pt-2">{error}</p>}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>
          <div className="border border-gray-800 p-4 rounded-lg bg-gray-700">
            <div className="mb-4">
              <p className="text-lg font-medium text-white">Cash: ${profile.portfolio.cash.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Stocks:</h3>
              <ul>
                {profile.portfolio.stocks.length === 0 ? (
                  <p className="text-lg text-white">No stocks in portfolio</p>
                ) : (
                  profile.portfolio.stocks.map((stock: any, index: any) => (
                    <li key={index} className="mb-2">
                      <p className="text-lg text-white">{stock.name}: {stock.quantity} shares</p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellStocks;
