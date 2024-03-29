"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";

const Stock: React.FC = () => {

  const [stockName, setStockName] = useState<string>("");
  const [stockDetails, setStockDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

      const response = await fetch(`/stock/${stockName}`);
      if (!response.ok) {
        throw new Error("Failed to fetch stock details");
      }
      const data = await response.json();      

      setStockDetails(data[0]);
      setError(null);
    } catch (error) {

      setError("Failed to fetch stock details");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-[#212121] p-8 rounded shadow-md w-96">
        <h1 className="text-4xl text-center font-semibold mb-8">Stock Finder</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
            placeholder="Enter Stock Symbol"
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
          {error && <p className="text-red-600 text-[16px] mb-4">{error}</p>}
        </form>
        {stockDetails && (
          <div className="mt-8 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Stock Details</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Name</p>
              <p className="text-white-700">{stockDetails.name}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Symbol</p>
              <p className="text-white-700">{stockDetails.symbol}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Price</p>
              <p className="text-white-700">{stockDetails.price}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Change</p>
              <p className="text-white-700">{stockDetails.change}</p>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Stock;
