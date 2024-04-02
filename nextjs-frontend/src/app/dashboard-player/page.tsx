import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";


const DashboardPlayer = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">

      <section className="text-center mt-16 mb-44">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>
      </section>
      
      <section className="text-center mt-8 mb-48">
      <div className="grid grid-cols-3 gap-32">
          {/* Buy/Sell Stock */}
          <Link className="dashboard-link" href="/buy">
            Buy Stock
          </Link>
          <Link className="dashboard-link" href="/sell">
            Sell Stock
          </Link>
          {/* Get Stock Details */}
          <Link className="dashboard-link" href="/stock">
            Get Stock Details
          </Link>
          {/* View Profile */}
          <Link className="dashboard-link" href="/profile">
            View Profile
          </Link>
          {/* Leaderboard */}
          <Link className="dashboard-link" href="/leaderboard">
            Leaderboard
          </Link>
          {/* Join a Game */}
          <Link className="dashboard-link" href="/join-game">
            Join a Game
          </Link>
        </div>
        </section>

      <Footer />
    </main>
  );
};

export default DashboardPlayer;